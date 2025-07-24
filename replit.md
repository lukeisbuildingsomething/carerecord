# Health Tracker - Personal Health Management System

## Overview

Health Tracker is a comprehensive personal health management application built with Flask that allows users to track and organize their medical information. The system provides a centralized platform for managing medications, test results, vital signs, medical documents, and personal health notes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Bootstrap 5 for responsive UI components
- **Icons**: Feather Icons for consistent iconography
- **Styling**: Custom CSS with CSS variables for theming
- **JavaScript**: Vanilla JavaScript for form validation and UI enhancements
- **Template Engine**: Jinja2 templates with Flask

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Data Storage**: JSON file-based storage (`data.json`)
- **File Handling**: Local file uploads with secure filename handling
- **Session Management**: Flask sessions with configurable secret key

### Application Structure
```
├── main.py                 # Main Flask application
├── data.json              # JSON data storage
├── templates/             # HTML templates
├── static/
│   ├── css/              # Custom styles
│   ├── js/               # JavaScript functionality
│   └── uploads/          # User uploaded files
```

## Key Components

### 1. Data Management
- **Storage Solution**: JSON file-based persistence
- **Data Structure**: Nested JSON with sections for profile, medications, tests, vitals, documents, and notebook
- **Backup Strategy**: Single file approach for easy backup and portability

### 2. Health Profile Management
- Medical conditions tracking with ICD codes
- Allergy management
- Family history recording
- Immunization tracking
- Medical events timeline

### 3. Medication Tracking
- Current and past medications
- Dosage and purpose tracking
- Prescriber information
- Medication movement between active/inactive status

### 4. Test Results & Vitals
- Lab test results with status indicators
- Vital signs tracking (blood pressure, heart rate, weight, temperature)
- Historical trending capabilities
- Test ordering physician tracking

### 5. Document Management
- File upload system with type validation
- Document categorization
- Secure file storage in uploads directory
- Support for multiple file formats (PDF, images, documents)

### 6. Health Notebook
- Doctor visit questions preparation
- Symptom tracking and notes
- Personal health journal entries
- Date-based organization

### 7. Doctor Visit Summary
- Printable summary generation
- Comprehensive medical information compilation
- Current medications overview
- Recent test results and vitals

## Data Flow

1. **User Input**: Forms collect health data through Bootstrap-styled interfaces
2. **Validation**: Client-side JavaScript validation with server-side processing
3. **Storage**: Data saved to JSON file with timestamp tracking
4. **Retrieval**: JSON data loaded and parsed for display
5. **File Handling**: Uploaded documents stored in static/uploads directory
6. **Export**: Doctor summary generates printable reports

## External Dependencies

### Frontend Libraries
- **Bootstrap 5**: CSS framework for responsive design
- **Feather Icons**: Icon library for consistent UI elements

### Backend Dependencies
- **Flask**: Web framework
- **Werkzeug**: File upload security utilities
- **Python Standard Library**: JSON, datetime, logging, os modules

### File Upload Security
- Filename sanitization using `secure_filename()`
- File type validation through extension checking
- Upload directory isolation

## Deployment Strategy

### Development Setup
- Single Python file application (`main.py`)
- Static file serving through Flask
- Environment variable configuration for session secret
- Debug logging enabled for development

### Production Considerations
- Session secret should be set via environment variable
- Upload directory permissions need proper configuration
- Consider implementing database migration from JSON for scalability
- Add backup strategy for data.json file
- Implement proper error handling for file operations

### Scalability Notes
- Current JSON storage suitable for single-user applications
- Database migration path available through existing data structure
- File upload system ready for cloud storage integration
- Modular template structure supports feature expansion

### Security Features
- Secure filename handling for uploads
- File type restrictions
- Session management with configurable secrets
- Input validation on forms