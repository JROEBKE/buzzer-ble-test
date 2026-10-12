
const SERVICE_UUID =
  "8b7e1000-1234-4567-890a-bcdef0123456";

const CHARACTERISTIC_UUID =
  "8b7e1001-1234-4567-890a-bcdef0123456";

const connectButton = document.getElementById("connect");
const statusText = document.getElementById("status");
const buttonState = document.getElementById("buttonState");

connectButton.addEventListener("click", async () => {
  try {
    if (!navigator.bluetooth) {
      throw new Error(
        "Web Bluetooth ist in diesem Browser-Kontext nicht verfügbar."
      );
    }

    statusText.textContent = "Suche nach Judo-Buzzer...";

    const device = await navigator.bluetooth.requestDevice({
      filters: [{ name: "Judo-Buzzer" }],
      optionalServices: [SERVICE_UUID]
    });

    device.addEventListener("gattserverdisconnected", () => {
      statusText.textContent = "Verbindung getrennt";
    });

    statusText.textContent = "Verbinde...";

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);

    const characteristic =
      await service.getCharacteristic(CHARACTERISTIC_UUID);

    await characteristic.startNotifications();

    characteristic.addEventListener(
      "characteristicvaluechanged",
      event => {
        const value = new TextDecoder().decode(
          event.target.value
        );

        buttonState.textContent = "Empfangen: " + value;
        console.log("BLE:", value);
      }
    );

    statusText.textContent = "Verbunden mit " + device.name;
  } catch (error) {
    statusText.textContent = "Fehler: " + error.message;
    console.error(error);
  }
});
