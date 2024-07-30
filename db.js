document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  
  if (form) {
      form.addEventListener('submit', async function(event) {
          event.preventDefault();
          
          const formData = new FormData(this);
          const data = Object.fromEntries(formData);

          try {
              const response = await fetch('/submit_form', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data)
              });

              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }

              const result = await response.json();
              alert(result.message);
              this.reset();
          } catch (error) {
              console.error('Error:', error);
              alert('There was an error submitting the form: ' + error.message);
          }
      });
  } else {
      console.error('Form with id "signupForm" not found');
  }
});