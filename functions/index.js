const functions = require("@google-cloud/functions-framework");
const https = require("https");

/**
 * HTTP Cloud Function для получения списка доступных iOS приложений
 */
functions.http("getApps", (req, res) => {
  // Настройка CORS для веб-страницы
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Обработка preflight запросов
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    scanGitHubApps()
      .then((apps) => {
        const response = {
          success: true,
          apps: apps,
          count: apps.length,
          generated: new Date().toISOString(),
        };

        res.status(200).json(response);
      })
      .catch((error) => {
        console.error("Ошибка при сканировании приложений:", error);
        res.status(500).json({
          success: false,
          error: "Ошибка при получении списка приложений",
          message: error.message,
        });
      });
  } catch (error) {
    console.error("Ошибка при сканировании приложений:", error);

    res.status(500).json({
      success: false,
      error: "Ошибка при получении списка приложений",
      message: error.message,
    });
  }
});

/**
 * Функция для проверки существования файла по URL
 */
function checkFileExists(url) {
  return new Promise((resolve) => {
    https
      .get(url, (res) => {
        resolve(res.statusCode === 200);
      })
      .on("error", () => {
        resolve(false);
      });
  });
}

/**
 * Функция для получения списка папок из GitHub через API
 */
function getGitHubDirectories() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: "/repos/ruslantsitser/ios_ad_hoc_test/contents/apps",
      method: "GET",
      headers: {
        "User-Agent": "ios-ad-hoc-scanner",
        Accept: "application/vnd.github.v3+json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const contents = JSON.parse(data);
          if (Array.isArray(contents)) {
            // Фильтруем только папки
            const directories = contents
              .filter((item) => item.type === "dir")
              .map((item) => item.name);
            resolve(directories);
          } else {
            resolve([]);
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * Функция для динамического сканирования приложений из GitHub
 */
async function scanGitHubApps() {
  const baseUrl = "https://ruslantsitser.github.io/ios_ad_hoc_test";
  const apps = [];

  try {
    // Получаем список папок из GitHub
    const directories = await getGitHubDirectories();
    console.log("Найденные папки в GitHub:", directories);

    // Проверяем каждую папку на наличие необходимых файлов
    for (const appName of directories) {
      const ipaUrl = `${baseUrl}/apps/${appName}/app.ipa`;
      const manifestUrl = `${baseUrl}/apps/${appName}/manifest.plist`;

      try {
        const [ipaExists, manifestExists] = await Promise.all([
          checkFileExists(ipaUrl),
          checkFileExists(manifestUrl),
        ]);

        if (ipaExists && manifestExists) {
          apps.push({
            name: appName,
            ipaUrl: ipaUrl,
            manifestUrl: manifestUrl,
          });
          console.log(`Найдено приложение: ${appName}`);
        }
      } catch (error) {
        console.error(`Ошибка при проверке ${appName}:`, error);
      }
    }
  } catch (error) {
    console.error("Ошибка при получении списка папок из GitHub:", error);
    // Fallback: возвращаем пустой массив
    return [];
  }

  return apps;
}
