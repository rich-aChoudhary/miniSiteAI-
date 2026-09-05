# app.py
from flask import Flask, request, jsonify
from models.aiResponseModel import AIResponseModel
from routes.userRoutes import user_routes

from flask import render_template

app = Flask(__name__)
app.register_blueprint(user_routes)

@app.route('/register')
def register():
    return render_template('login.html')


@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/portfolio/<int:portfolio_id>')
def view_portfolio(portfolio_id):
    portfolio = AIResponseModel.get_portfolio_by_id(portfolio_id)
    if not portfolio:
        return jsonify({'error': 'Portfolio not found'}), 404
    return portfolio['html_content']  # Directly return HTML content


if __name__ == '__main__':
    app.run(debug=True, port=3000)
