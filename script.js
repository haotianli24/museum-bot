let port;
let writer;
let isConnected = false;
let currentLanguage = 'en';
let isLargeText = false;
let isHighContrast = false;

// Show selected section and hide others
function showSection(sectionName) {
    const sections = ['language', 'exhibits', 'accessibility', 'about'];
    sections.forEach(section => {
        const element = document.getElementById(`${section}-section`);
        element.classList.toggle('hidden', section !== sectionName);
    });
}

// Language selection
function setLanguage(lang) {
    currentLanguage = lang;
    document.getElementById("status").innerText = `Language set to: ${lang.toUpperCase()}`;
}

// Accessibility functions
function toggleFontSize() {
    isLargeText = !isLargeText;
    document.body.classList.toggle('large-text', isLargeText);
}

function toggleContrast() {
    isHighContrast = !isHighContrast;
    document.body.classList.toggle('high-contrast', isHighContrast);
}

// Request access to the serial port when the page loads
async function connectSerial() {
    try {
        // Check if running on Android Chrome
        if (!navigator.usb && !navigator.serial) {
            throw new Error("WebUSB not supported. Please use Chrome for Android.");
        }
        
        // Try WebUSB first (Android)
        if (navigator.usb) {
            const device = await navigator.usb.requestDevice({
                filters: [{ vendorId: 0x2341 }] // Arduino vendor ID
            });
            await device.open();
            await device.selectConfiguration(1);
            await device.claimInterface(0);
            port = device;
        } else {
            // Fallback to Web Serial API
            port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });
        }
        
        writer = port.writable.getWriter();
        document.getElementById("status").innerText = "Connected to the robot!";
        isConnected = true;
    } catch (error) {
        console.error("Error connecting to serial port:", error);
        document.getElementById("status").innerText = 
            "Failed to connect. Please ensure USB debugging is enabled and the cable is connected.";
    }
}

// Function to send commands to the Arduino based on user input
async function navigateToExhibit(exhibit) {
    if (!isConnected || !writer) {
        alert("Not connected to the robot. Please connect via USB.");
        return;
    }

    try {
        // Send command to move forward for 2 seconds
        const command = new TextEncoder().encode(`MOVE_${exhibit}\n`);
        await writer.write(command);
        document.getElementById("status").innerText = `Moving to Exhibit ${exhibit}...`;
        
        // Wait for 2 seconds
        setTimeout(() => {
            document.getElementById("status").innerText = `Arrived at Exhibit ${exhibit}`;
        }, 2000);
    } catch (error) {
        console.error("Error sending command:", error);
        document.getElementById("status").innerText = "Error moving to exhibit";
    }
}

// Automatically try to connect to the serial port when the page loads
window.onload = connectSerial;
