// Motor control pins
const int LEFT_MOTOR_PIN = 5;  // Change these pin numbers
const int RIGHT_MOTOR_PIN = 6; // according to your setup

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  
  // Set motor pins as outputs
  pinMode(LEFT_MOTOR_PIN, OUTPUT);
  pinMode(RIGHT_MOTOR_PIN, OUTPUT);
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    
    if (command.startsWith("MOVE_")) {
      // Move forward for 2 seconds
      digitalWrite(LEFT_MOTOR_PIN, HIGH);
      digitalWrite(RIGHT_MOTOR_PIN, HIGH);
      delay(2000);
      // Stop
      digitalWrite(LEFT_MOTOR_PIN, LOW);
      digitalWrite(RIGHT_MOTOR_PIN, LOW);
    }
  }
}
