import "./App.css";
import React, { useState } from "react";

function Welcome() {
  return (
    <div className="vertical-center header">
      <img
        src="https://fixmycrack.co.uk/wp-content/uploads/2023/08/Shard-Logo-Teal-Larger_1660046378.webp"
        alt="Fix My Crack Logo"
      />
    </div>
  );
}

function Form({ setIsSubmitted, setResponse, setReturnCode }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [referral, setReferral] = useState("Other");
  const [consent, setConsent] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitted(true);

    try {
      const response = await fetch(
        "https://fixmycrack.repairshopr.com/api/v1/customers",
        {
          method: "POST",
          headers: {
            Authorization:
              process.env.AUTH_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            email: email,
            mobile: mobile,
            referred_by: referral,
            get_sms: true,
            consent: {
              marketing: "1",
              "notice_emails:": "1",
              store_data: consent ? "1" : "0",
            },
          }),
        }
      );

      const result = await response.json();

      console.log("Response", result);
      setResponse(result);
      setReturnCode(Number(!response.ok));
    } catch (error) {
      console.error("Error:", error);
      setResponse(error);
      setReturnCode(2);
    }
  };

  return (
    <form onSubmit={handleSubmit} autocomplete="off">
      <div>
        <label for="firstname">First Name</label>
        <input
          type="text"
          id="firstname"
          name="user_firstname"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
        />
      </div>
      <div>
        <label for="lastname">Last Name</label>
        <input
          type="text"
          id="lastname"
          name="user_lastname"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
        />
      </div>
      <div>
        <label for="mail">E-mail</label>
        <input
          type="email"
          id="mail"
          name="user_mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label for="mobile">Mobile</label>
        <input
          type="tel"
          id="mobile"
          name="user_mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>
      <div className="refer">
        <label for="referral">How did you hear about us?</label>
        <select
          id="referral"
          name="user_referral"
          value={referral}
          onChange={(e) => setReferral(e.target.value)}
          required
        >
          <option value="Google">Google</option>
          <option value="Friend">Friend</option>
          <option value="Other">Other</option>
          <option value="Sign">Sign</option>
        </select>
      </div>
      <div className="consent">
        <label for="Consent">
          I agree to let you store my data. This is vital to using our service.
        </label>
        <input
          type="checkbox"
          id="Consent"
          name="user_consent"
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
      </div>

      <div className="consent">
        <label for="comm">
          I agree to let you email me with normal shop communication messages.
        </label>
        <input
            type="checkbox"
            id="comm"
            name="user_consent"
            onChange={(e) => setConsent(e.target.checked)}
            required
          />
      </div>

      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

function ServerError({ response }) {
  return (
    <div>
      <h1>Server Error</h1>
      <p>{JSON.stringify(response)}</p>
    </div>
  );
}

function DataError({ response }) {
  return (
    <div>
      <h1>Data Error</h1>
      <p>{response.message}</p>
    </div>
  );
}

function Result({ response }) {
  return (
    <div>
      <h1>Success</h1>
      <p>
        {response.customer.firstname} {response.customer.lastname}
      </p>
      <p>{response.customer.email}</p>
      <p>{response.customer.mobile}</p>
    </div>
  );
}

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [response, setResponse] = useState(null);
  const [returnCode, setReturnCode] = useState(-1);

  return (
    <div>
      {!isSubmitted && <Welcome />}
      {!isSubmitted && (
        <Form
          setIsSubmitted={setIsSubmitted}
          setResponse={setResponse}
          setReturnCode={setReturnCode}
        />
      )}
      {isSubmitted && returnCode === 0 && <Result response={response} />}
      {isSubmitted && returnCode === 1 && <DataError response={response} />}
      {isSubmitted && returnCode === 2 && <ServerError response={response} />}
    </div>
  );
}

export default App;

