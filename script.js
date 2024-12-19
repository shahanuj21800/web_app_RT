const SERVICE_UUID = "a4e49a1e-d4b6-4385-b18d-81bd1a2cf4d7";
const CHARACTERISTIC_UUID = "ed01a752-e2ed-488f-b0a6-1f55ae5e6265";

let connectedDevices = []; // Store connected devices and their characteristics

// Function to connect to devices
async function connectToDevice() {
    try {
        console.log("Requesting Bluetooth device...");
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true, // Allow selection of any device
            optionalServices: [SERVICE_UUID],
        });

        console.log(`Connecting to ${device.name}...`);
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(SERVICE_UUID);
        const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

        connectedDevices.push({ device, characteristic });
        console.log(`Connected to ${device.name}`);
    } catch (error) {
        console.error("Failed to connect:", error);
    }
}

// Function to send a number to all connected devices
async function sendNumberToAllDevices() {
    const number = document.getElementById("numberInput").value;
    const data = new TextEncoder().encode(number);

    for (const { device, characteristic } of connectedDevices) {
        if (device.gatt.connected) {
            try {
                await characteristic.writeValue(data);
                console.log(`Sent ${number} to ${device.name}`);
            } catch (error) {
                console.error(`Failed to send to ${device.name}:`, error);
            }
        } else {
            console.log(`${device.name} is not connected.`);
        }
    }
}

// Function to disconnect all devices
async function disconnectAllDevices() {
    for (const { device } of connectedDevices) {
        if (device.gatt.connected) {
            try {
                await device.gatt.disconnect();
                console.log(`Disconnected from ${device.name}`);
            } catch (error) {
                console.error(`Failed to disconnect from ${device.name}:`, error);
            }
        }
    }
    connectedDevices = [];
    console.log("Disconnected from all devices.");
}