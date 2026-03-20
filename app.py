from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    # To polecenie szuka pliku rodzic.html w folderze 'templates'
    return render_template('rodzic.html')

if __name__ == '__main__':
    app.run(debug=True)