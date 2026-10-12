
const SERVICE_UUID = "8b7e1000-1234-4567-890a-bcdef0123456";
const CHARACTERISTIC_UUID = "8b7e1001-1234-4567-890a-bcdef0123456";

const connectButton = document.getElementById("connect");
const statusText = document.getElementById("status");
const buttonState = document.getElementById("buttonState");

connectButton.addEventListener("click", async () => {
  try {
    statusText.textContent = "1. Bluetooth-Suche wird gestartet …";

    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [SERVICE_UUID]
    });

    statusText.textContent = "2. Gerät ausgewählt: " + device.name;

    device.addEventListener("gattserverdisconnected", () => {
      statusText.textContent = "Verbindung getrennt";
    });

    statusText.textContent = "3. Verbinde mit " + device.name + " …";

    const server = await device.gatt.connect();
    statusText.textContent = "4. Bluetooth-Verbindung hergestellt";

    const service = await server.getPrimaryService(SERVICE_UUID);
    const characteristic =
      await service.getCharacteristic(CHARACTERISTIC_UUID);

    await characteristic.startNotifications();

    characteristic.addEventListener(
      "characteristicvaluechanged",
      event => {
        const value = new TextDecoder().decode(event.target.value);
        buttonState.textContent = "Empfangen: " + value;
      }
    );

    statusText.textContent = "Verbunden mit " + device.name;
  } catch (error) {
    statusText.textContent = "Fehler: " + error.name + " – " + error.message;
    console.error("Bluetooth-Fehler:", error);
  }
});
