import os
import json
import logging
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory
from werkzeug.utils import secure_filename

# Configure logging for debugging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "health-tracker-secret-key")

# Configuration
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_data():
    """Load health data from JSON file"""
    try:
        with open('data.json', 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        # Initialize with empty structure if file doesn't exist
        default_data = {
            'profile': {
                'conditions': [],
                'allergies': [],
                'family_history': [],
                'immunizations': [],
                'events': []
            },
            'medications': {
                'current': [],
                'past': []
            },
            'tests': [],
            'vitals': [],
            'documents': [],
            'notebook': {
                'questions': [],
                'symptoms': [],
                'journal': []
            },
            'last_updated': datetime.now().isoformat()
        }
        save_data(default_data)
        return default_data

def save_data(data):
    """Save health data to JSON file"""
    data['last_updated'] = datetime.now().isoformat()
    with open('data.json', 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def dashboard():
    """Dashboard with summary cards"""
    data = load_data()
    
    # Calculate summary statistics
    conditions_count = len(data['profile']['conditions'])
    current_meds_count = len(data['medications']['current'])
    recent_tests = sorted(data['tests'], key=lambda x: x['date'], reverse=True)[:3]
    
    last_updated = data.get('last_updated')
    if last_updated:
        last_updated = datetime.fromisoformat(last_updated).strftime('%B %d, %Y at %I:%M %p')
    
    return render_template('dashboard.html', 
                         conditions_count=conditions_count,
                         current_meds_count=current_meds_count,
                         recent_tests=recent_tests,
                         last_updated=last_updated)

@app.route('/profile')
def profile():
    """Profile page with conditions, allergies, family history, etc."""
    data = load_data()
    return render_template('profile.html', profile=data['profile'])

@app.route('/add_condition', methods=['POST'])
def add_condition():
    """Add a new condition"""
    data = load_data()
    condition = {
        'name': request.form['name'],
        'icd_code': request.form.get('icd_code', ''),
        'date_diagnosed': request.form['date_diagnosed'],
        'notes': request.form.get('notes', '')
    }
    data['profile']['conditions'].append(condition)
    save_data(data)
    flash('Condition added successfully', 'success')
    return redirect(url_for('profile'))

@app.route('/add_allergy', methods=['POST'])
def add_allergy():
    """Add a new allergy"""
    data = load_data()
    allergy = {
        'allergen': request.form['allergen'],
        'reaction': request.form['reaction'],
        'severity': request.form['severity']
    }
    data['profile']['allergies'].append(allergy)
    save_data(data)
    flash('Allergy added successfully', 'success')
    return redirect(url_for('profile'))

@app.route('/add_family_history', methods=['POST'])
def add_family_history():
    """Add family history entry"""
    data = load_data()
    history = {
        'relative': request.form['relative'],
        'condition': request.form['condition'],
        'age_at_diagnosis': request.form.get('age_at_diagnosis', ''),
        'notes': request.form.get('notes', '')
    }
    data['profile']['family_history'].append(history)
    save_data(data)
    flash('Family history added successfully', 'success')
    return redirect(url_for('profile'))

@app.route('/add_immunization', methods=['POST'])
def add_immunization():
    """Add immunization record"""
    data = load_data()
    immunization = {
        'vaccine': request.form['vaccine'],
        'date': request.form['date'],
        'provider': request.form.get('provider', ''),
        'lot_number': request.form.get('lot_number', '')
    }
    data['profile']['immunizations'].append(immunization)
    save_data(data)
    flash('Immunization added successfully', 'success')
    return redirect(url_for('profile'))

@app.route('/medications')
def medications():
    """Medications page"""
    data = load_data()
    return render_template('medications.html', medications=data['medications'])

@app.route('/add_medication', methods=['POST'])
def add_medication():
    """Add a new medication"""
    data = load_data()
    medication = {
        'name': request.form['name'],
        'dose': request.form['dose'],
        'purpose': request.form['purpose'],
        'prescribed_by': request.form.get('prescribed_by', ''),
        'start_date': request.form['start_date'],
        'notes': request.form.get('notes', '')
    }
    
    med_type = request.form['type']  # 'current' or 'past'
    if med_type == 'past':
        medication['end_date'] = request.form.get('end_date', '')
        
    data['medications'][med_type].append(medication)
    save_data(data)
    flash(f'{"Current" if med_type == "current" else "Past"} medication added successfully', 'success')
    return redirect(url_for('medications'))

@app.route('/move_medication/<int:index>/<from_type>/<to_type>')
def move_medication(index, from_type, to_type):
    """Move medication between current and past"""
    data = load_data()
    
    if index < len(data['medications'][from_type]):
        medication = data['medications'][from_type].pop(index)
        
        if to_type == 'past' and 'end_date' not in medication:
            medication['end_date'] = datetime.now().strftime('%Y-%m-%d')
        elif to_type == 'current' and 'end_date' in medication:
            del medication['end_date']
            
        data['medications'][to_type].append(medication)
        save_data(data)
        flash(f'Medication moved to {to_type}', 'success')
    
    return redirect(url_for('medications'))

@app.route('/tests')
def tests():
    """Tests and lab results page"""
    data = load_data()
    # Sort tests by date (most recent first)
    sorted_tests = sorted(data['tests'], key=lambda x: x['date'], reverse=True)
    return render_template('tests.html', tests=sorted_tests)

@app.route('/add_test', methods=['POST'])
def add_test():
    """Add a new test result"""
    data = load_data()
    
    # Handle file upload
    filename = None
    if 'file' in request.files:
        file = request.files['file']
        if file and file.filename and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Add timestamp to avoid conflicts
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
            filename = timestamp + filename
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    
    test = {
        'name': request.form['name'],
        'date': request.form['date'],
        'result_notes': request.form['result_notes'],
        'status': request.form['status'],
        'file': filename,
        'ordered_by': request.form.get('ordered_by', '')
    }
    
    data['tests'].append(test)
    save_data(data)
    flash('Test result added successfully', 'success')
    return redirect(url_for('tests'))

@app.route('/vitals')
def vitals():
    """Vitals tracking page"""
    data = load_data()
    # Sort vitals by date (most recent first)
    sorted_vitals = sorted(data['vitals'], key=lambda x: x['date'], reverse=True)
    return render_template('vitals.html', vitals=sorted_vitals)

@app.route('/add_vital', methods=['POST'])
def add_vital():
    """Add a new vital entry"""
    data = load_data()
    vital = {
        'date': request.form['date'],
        'blood_pressure': request.form.get('blood_pressure', ''),
        'heart_rate': request.form.get('heart_rate', ''),
        'weight': request.form.get('weight', ''),
        'temperature': request.form.get('temperature', ''),
        'notes': request.form.get('notes', '')
    }
    
    data['vitals'].append(vital)
    save_data(data)
    flash('Vital signs added successfully', 'success')
    return redirect(url_for('vitals'))

@app.route('/documents')
def documents():
    """Documents and files page"""
    data = load_data()
    return render_template('documents.html', documents=data['documents'])

@app.route('/add_document', methods=['POST'])
def add_document():
    """Add a new document"""
    data = load_data()
    
    # Handle file upload
    filename = None
    if 'file' in request.files:
        file = request.files['file']
        if file and file.filename and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Add timestamp to avoid conflicts
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
            filename = timestamp + filename
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    
    document = {
        'title': request.form['title'],
        'category': request.form['category'],
        'date': request.form['date'],
        'description': request.form.get('description', ''),
        'file': filename
    }
    
    data['documents'].append(document)
    save_data(data)
    flash('Document added successfully', 'success')
    return redirect(url_for('documents'))

@app.route('/notebook')
def notebook():
    """Health notebook page"""
    data = load_data()
    return render_template('notebook.html', notebook=data['notebook'])

@app.route('/add_notebook_entry', methods=['POST'])
def add_notebook_entry():
    """Add entry to notebook"""
    data = load_data()
    entry_type = request.form['type']  # 'questions', 'symptoms', 'journal'
    
    entry = {
        'date': datetime.now().strftime('%Y-%m-%d'),
        'content': request.form['content']
    }
    
    if entry_type == 'journal':
        entry['title'] = request.form.get('title', '')
    
    data['notebook'][entry_type].append(entry)
    save_data(data)
    flash(f'{entry_type.capitalize()} entry added successfully', 'success')
    return redirect(url_for('notebook'))

@app.route('/doctor_summary')
def doctor_summary():
    """Printable doctor visit summary"""
    data = load_data()
    
    # Get current medications
    current_meds = data['medications']['current']
    
    # Get active conditions
    active_conditions = data['profile']['conditions']
    
    # Get last 3 test results
    recent_tests = sorted(data['tests'], key=lambda x: x['date'], reverse=True)[:3]
    
    # Get recent notebook entries
    recent_questions = data['notebook']['questions'][-5:] if data['notebook']['questions'] else []
    recent_symptoms = data['notebook']['symptoms'][-5:] if data['notebook']['symptoms'] else []
    recent_journal = data['notebook']['journal'][-3:] if data['notebook']['journal'] else []
    
    return render_template('doctor_summary.html',
                         current_meds=current_meds,
                         active_conditions=active_conditions,
                         recent_tests=recent_tests,
                         recent_questions=recent_questions,
                         recent_symptoms=recent_symptoms,
                         recent_journal=recent_journal,
                         generated_date=datetime.now().strftime('%B %d, %Y'))

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
