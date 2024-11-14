let bluetoothDevice;
let bluetoothServer;
let robotService;
let writer;
let isConnected = false;

async function connectBluetooth() {
    try {
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            filters: [{ name: 'HC-05' }], // Adjust name if needed
            optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'] // Common service UUID for HC-05
        });

        bluetoothServer = await bluetoothDevice.gatt.connect();
        robotService = await bluetoothServer.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
        writer = await robotService.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');

        isConnected = true;
        document.getElementById("status").innerText = "Connected to the robot via Bluetooth!";
    } catch (error) {
        console.error("Bluetooth connection failed:", error);
        document.getElementById("status").innerText = "Failed to connect via Bluetooth.";
    }
}

async function navigateToExhibit(exhibit) {
    if (!isConnected || !writer) {
        alert("Not connected to the robot. Please connect via Bluetooth.");
        return;
    }

    try {
        const command = new TextEncoder().encode(`MOVE_${exhibit}\n`);
        await writer.writeValue(command);
        document.getElementById("status").innerText = `Moving to Exhibit ${exhibit}...`;

        setTimeout(() => {
            document.getElementById("status").innerText = `Arrived at Exhibit ${exhibit}`;
        }, 2000);
    } catch (error) {
        console.error("Error sending command:", error);
        document.getElementById("status").innerText = "Error moving to exhibit.";
    }
}
