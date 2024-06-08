from flask import Flask, render_template, request, jsonify, redirect, url_for
import pandas as pd
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER 

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
else:
    folder_contents = os.listdir(UPLOAD_FOLDER)
    for file_name in folder_contents:
        file_path = os.path.join(UPLOAD_FOLDER, file_name)
        os.remove(file_path)
        
        
@app.route('/')
def index():
    return render_template('analysis.html')

@app.route('/infodesc', methods=['POST'])
def infodesc():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    if file:
        filename = file.filename
        try:
            if filename.endswith('.csv'):
                df = pd.read_csv(file)
            elif filename.endswith('.xlsx'):
                df = pd.read_excel(file)
            else:
                return jsonify({'error': 'Unsupported file format'})
            info = "class <'pandas.core.frame.DataFrame'>\n"
            info += "RangeIndex:" + str(len(df)) + " entries, " + str(df.index[0]) + " to " + str(df.index[-1])
            info += "<br>\nData columns (total " + str(len(df.columns)) + " columns):\n"
            info += "<table style='width:90%'><thead><th>#</th><th style='width:30%'>Column</th><th>Non-Null</th><th>Count</th><th>Dtype</th></thead>"
            for i in df.columns:
                info+="<tbody><td>{}</td><td>{}</td><td>{}</td><td>non-null</td><td>{}</td>".format(df.columns.get_loc(i), i, df[i].count(), df[i].dtype)
            info+="</tbody></table>"
            info += "<br><table style='width:90%'><tr><th>dtypes</th><td>"+ ', '.join(set([str(df[column].dtype) for column in df.columns]))+"</td></tr>"
            info += "<tr><th>Memory Usage</th><td>{}</td></tr>".format(df.memory_usage().sum())
            info += "<tr><th>Shape</th><td>({}, {})</td></tr></table>".format(str(len(df)), str(len(df.columns)))
            desc = df.describe().to_dict()
            print(desc)
            data_dict = {'infot':info,'desc':desc}
            return jsonify(data_dict)
        
        except Exception as e:
            return jsonify({'error': str(e)})


@app.route('/RmNuDu', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    if file:
        filename = file.filename
        try:
            if filename.endswith('.csv'):
                df = pd.read_csv(file)
            elif filename.endswith('.xlsx'):
                df = pd.read_excel(file)
            else:
                return jsonify({'error': 'Unsupported file format'})
            df = df.dropna().drop_duplicates()
            modified_file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'infodesc_' + filename)
            df.to_csv(modified_file_path, index=False)
            return jsonify({'file_path': modified_file_path})
        except Exception as e:
            return jsonify({'error': str(e)})

    return jsonify({'error': 'Invalid file'})


if __name__ == '__main__':
    app.run('127.0.0.1',5003,True)

