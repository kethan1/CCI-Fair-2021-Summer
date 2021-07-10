from flask import Flask, render_template
import os


app = Flask(__name__)


@app.route('/')
def home():
    return render_template('home.html')


if __name__ == "__main__":
    if "DYNO" not in os.environ:
        # Need to run the camera on https
        context = (os.path.join(os.path.dirname(__file__), 'cert.pem'), os.path.join(os.path.dirname(__file__), 'key.pem'))
        app.run(host='0.0.0.0', port='443', debug=True, ssl_context=context)
    else:
        app.run()
