# ml_api.py
from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# Load the trained model
with open("loan_risk_model.pkl", "rb") as f:
    data = pickle.load(f)
    model = data['model']
    le = data['le']

@app.route("/predict", methods=["POST"])
def predict():
    try:
        req_data = request.get_json()

        # Extract features
        applicant_income = float(req_data.get("monthlyIncome", 0))
        coapplicant_income = float(req_data.get("coapplicantIncome", 0))
        loan_amount = float(req_data.get("loanAmount", 0))
        loan_term = float(req_data.get("loanTerm", 360))
        employment_status = req_data.get("employmentStatus", "employed")

        # Encode employment status
        employment_encoded = le.transform([employment_status])[0]

        # Prepare dataframe for prediction
        X = pd.DataFrame([{
            "ApplicantIncome": applicant_income,
            "CoapplicantIncome": coapplicant_income,
            "LoanAmount": loan_amount,
            "Loan_Amount_Term": loan_term,
            "employmentStatus": employment_encoded
        }])

        # Predict risk category
        prediction = model.predict(X)[0]
        prediction_proba = model.predict_proba(X).tolist()[0]

        return jsonify({
            "riskCategory": prediction,
            "probabilities": prediction_proba
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=6000, debug=True)