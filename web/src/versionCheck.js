export async function checkForNewVersion() {
  try {
    const response = await fetch('/version.json', { cache: 'no-cache' });
    const { version: latestVersion } = await response.json();

    const currentVersion = localStorage.getItem('appVersion');

    if (currentVersion && currentVersion !== latestVersion) {
      console.log('🚀 Новая версия доступна, обновляем страницу!');
      localStorage.setItem('appVersion', latestVersion);
      window.location.reload(true);
    } else {
      localStorage.setItem('appVersion', latestVersion);
    }
  } catch (error) {
    console.error('Ошибка проверки версии:', error);
  }
}
