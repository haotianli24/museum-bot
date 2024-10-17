let port;
let writer;
let isConnected = false;

// Request access to the serial port when the page loads
async function connectSerial() {
    try {
        // Ask user to select the Arduino's serial port
        port = await navigator.serial.requestPort();
        // Open the serial port at a baud rate of 9600
        await port.open({ baudRate: 9600 });
        writer = port.writable.getWriter(); // Create a writer to send data to the port
        document.getElementById("status").innerText = "Connected to the robot!";
        isConnected = true;
    } catch (error) {
        console.error("Error connecting to serial port:", error);
        document.getElementById("status").innerText = "Failed to connect. Please check USB connection.";
    }
}

// Function to send commands to the Arduino based on user input
async function navigateToExhibit(exhibit) {
    if (!isConnected || !writer) {
        alert("Not connected to the robot. Please connect via USB.");
        return;
    }

    try {
        // Prepare the command to send ('A', 'B', 'C', etc.)
        const command = new TextEncoder().encode(exhibit + "\n");
        await writer.write(command); // Send the command to the Arduino
        alert(`Navigating to Exhibit ${exhibit}`);
    } catch (error) {
        console.error("Error sending command:", error);
    }
}

// Automatically try to connect to the serial port when the page loads
window.onload = connectSerial;
