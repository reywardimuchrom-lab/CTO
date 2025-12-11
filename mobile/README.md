# Mobile App (Flutter)

This is the mobile application built with Flutter.

## Tech Stack

- **Flutter 3.16+** - UI framework
- **Dart** - Programming language
- **Provider** - State management
- **Dio** - HTTP client
- **SharedPreferences** - Local storage

## Project Structure

```
mobile/
├── android/          # Android-specific files
├── ios/              # iOS-specific files
├── lib/
│   ├── screens/      # Screen widgets
│   ├── widgets/      # Reusable widgets
│   ├── services/     # API and other services
│   ├── models/       # Data models
│   ├── providers/    # State management
│   ├── utils/        # Utility functions
│   └── main.dart     # Entry point
├── test/             # Tests
├── pubspec.yaml      # Dependencies
└── analysis_options.yaml  # Linter configuration
```

## Prerequisites

- Flutter SDK 3.16+ (see `.tool-versions`)
- Dart SDK (included with Flutter)
- Android Studio or Xcode (for mobile development)

## Setup

1. Install Flutter dependencies:
```bash
flutter pub get
```

2. Check Flutter setup:
```bash
flutter doctor
```

## Running Locally

### Run on emulator/simulator:
```bash
flutter run
```

### Run on specific device:
```bash
flutter devices
flutter run -d <device-id>
```

### Run in debug mode:
```bash
flutter run --debug
```

### Run in release mode:
```bash
flutter run --release
```

## Development Commands

### Get dependencies:
```bash
flutter pub get
```

### Analyze code:
```bash
flutter analyze
```

### Format code:
```bash
dart format .
```

### Run tests:
```bash
flutter test
```

### Run tests with coverage:
```bash
flutter test --coverage
```

### Clean build:
```bash
flutter clean
flutter pub get
```

## Building

### Android APK:
```bash
flutter build apk
```

### Android App Bundle:
```bash
flutter build appbundle
```

### iOS:
```bash
flutter build ios
```

## Platform-Specific Setup

### Android

1. Configure `android/app/build.gradle` for your app
2. Set up signing keys for release builds
3. Update `android/app/src/main/AndroidManifest.xml`

### iOS

1. Open `ios/Runner.xcworkspace` in Xcode
2. Configure signing & capabilities
3. Update `ios/Runner/Info.plist`

## Environment Variables

The app connects to the backend API. Update the `baseUrl` in `lib/services/api_service.dart` or use environment-specific configuration.

## Development Guidelines

- Use `const` constructors where possible
- Follow Flutter style guide
- Keep widgets small and focused
- Use proper state management with Provider
- Write tests for business logic
- Handle errors gracefully
- Use meaningful names for variables and methods
