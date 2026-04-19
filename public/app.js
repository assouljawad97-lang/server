async function loadMeta() {
  try {
    const response = await fetch('/api/meta');
    const data = await response.json();
    if (!data || !data.ok) return;
    const windows = document.getElementById('downloadWindows');
    const mac = document.getElementById('downloadMac');
    const windowsHero = document.getElementById('downloadWindowsHero');
    const macHero = document.getElementById('downloadMacHero');
    if (windows) windows.href = data.downloads.windows || '#';
    if (mac) mac.href = data.downloads.mac || '#';
    if (windowsHero) windowsHero.href = data.downloads.windows || '#';
    if (macHero) macHero.href = data.downloads.mac || '#';
  } catch (error) {
    // ignore
  }
}

const yearNode = document.getElementById('yearNow');
if (yearNode) yearNode.textContent = String(new Date().getFullYear());

loadMeta();
