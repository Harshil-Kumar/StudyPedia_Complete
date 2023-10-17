from flask import Flask, request, render_template, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SECRET_KEY'] = 'StudyPedia'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(50), nullable=False)

@app.route('/')
def hello_world():
    return render_template("signup.html")

@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    password = request.form['password']
    name = request.form['name']

    if User.query.filter_by(username=username).first():
        return render_template('signup.html', info='Username already exists')

    with app.app_context():
        new_user = User(username=username, password=password, name=name)

        db.session.add(new_user)
        db.session.commit()

    return redirect(url_for('login'))

@app.route('/form_login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        with app.app_context():
            user = User.query.filter_by(username=username, password=password).first()
            if user:
                session['username'] = user.name
                return redirect(url_for('index', username=username))
            else:
                return render_template('login.html', error="Invalid username or password")
    else:
        return render_template('login.html')

@app.route('/home')
def index():
    username = request.args.get('username')  
    user = User.query.filter_by(username=username).first()  
    return render_template('index.html', user=user)

@app.route('/difference')
def difference():
    return render_template('difference.html')

@app.route('/connection')
def connection():
    return render_template('connection.html')

@app.route('/language')
def language():
    username = session.get('username')
    return render_template('language.html', username=username)

@app.route('/lang_difference')
def lang_difference():
    return render_template('lang_difference.html')

@app.route('/lang_connection')
def lang_connection():
    return render_template('lang_connection.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
