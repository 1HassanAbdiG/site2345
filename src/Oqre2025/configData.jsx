// configData.js (ensure this file exists with your data)
export const config = {
    grades: ["3e", "6e"],
    subjects: ["Français", "Maths"],
  };
  
  export const docConfig = {
    "3e": {
      "Français": {
        "pdf": "/oqre/fr/chaise3e.pdf", // Path relative to public folder
        "googleForm": "https://forms.gle/ofisQL3XSsrNEm568"
      },
      "Maths": {
        "pdf": "/oqre/Math/MATHS32015.pdf", // Path relative to public folder
        "googleForm": "https://forms.gle/h5GEUDZJupD8rq7D9"
        
      }
    },
    "6e": {
      // --- Add configuration for 6e here ---
      "Français": {
          "pdf": "/oqre/fr/pieuvre.pdf", // Replace with actual 6e French PDF path
          //"googleForm": "https://docs.google.com/forms/d/e/1FAIpQLSdKfTEn_SxRaVjJ_7GqXVdycdR3_5jVjmwBB3mFERKXhxWM6A/viewform"
          "googleForm": "https://forms.gle/gQ6nnuLpeqq4trjK6"
        },
        "Maths": {
          "pdf": "", // Replace with actual 6e Maths PDF path
          "googleForm": "https://forms.gle/rttkHeyygVtz4AZ98"
        }
    }
  };