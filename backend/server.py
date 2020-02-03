from src.create_app import create_app

app = create_app()

from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, current_user
@app.route('/protected', methods=['GET'])
@jwt_required
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


if __name__ == '__main__':
    app.run(host='localhost', port=8080, debug=True)
