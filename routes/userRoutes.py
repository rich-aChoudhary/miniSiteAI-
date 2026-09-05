# routes/user_routes.py
from flask import Blueprint, request, jsonify
from controllers.userController import UserController

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    response, status = UserController.register_user(data)
    return jsonify(response), status

@user_routes.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    response, status = UserController.login_user(data)
    return jsonify(response), status


@user_routes.route('/verify-email')
def verify_email():
    token = request.args.get('token')
    response, status = UserController.verify_email(token)
    return jsonify(response), status

@user_routes.route('/api/generate-portfolio', methods=['POST'])
def generate_portfolio():
    req = request.get_json()
    response, status_code = UserController.process_ai(
        req.get('data'),
        req.get('title', ''),
        req.get('userId')
    )

    return jsonify(response), status_code



@user_routes.route('/api/my-portfolios/<int:user_id>')
def get_user_portfolios(user_id):
    portfolios = UserController.get_user_portfolios(user_id)
    if not portfolios:
        result = {'message': 'No portfolios found for this user.'}
    else:
        result = portfolios
    return jsonify(result)

@user_routes.route('/api/portfolio/<int:portfolio_id>')
def get_portfolio(portfolio_id):
    portfolio = UserController.get_portfolio(portfolio_id)
    if not portfolio:
        return jsonify({'message': 'Portfolio not found.'}), 404
    return jsonify(portfolio['html_content'])
@user_routes.route('/api/portfolio/<int:portfolio_id>', methods=['DELETE'])
def delete_portfolio_route(portfolio_id):
    response, status = UserController.delete_portfolio(portfolio_id)
    return jsonify(response), status
@user_routes.route('/api/save-portfolio/<int:portfolio_id>', methods=['PUT'])
def save_portfolio(portfolio_id):
    req = request.get_json()
    content = req.get('content', '')
    if not content:
        return jsonify({'error': 'Content is required'}), 400
    
    try:
        UserController.save_edited_changes(portfolio_id, content)
        return jsonify({'message': 'Portfolio saved successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500