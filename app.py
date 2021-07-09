from flask import Flask, render_template
import os


app = Flask(__name__)


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/camera')
def camera():
    return render_template('camera.html')


if __name__ == "__main__":
    if "DYNO" not in os.environ:
        context = (os.path.join(os.path.dirname(__file__), 'cert.pem'), os.path.join(os.path.dirname(__file__), 'key.pem'))
        app.run(host='0.0.0.0', port='443', debug=True, ssl_context=context)
    else:
        app.run()
