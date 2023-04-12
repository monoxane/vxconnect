import React from "react";

export default function ErrorPage() {  
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </p>
    </div>
  );
}

