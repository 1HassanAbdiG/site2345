// configData.js (ensure this file exists with your data)
export const config = {
    grades: ["3e", "6e"],
    subjects: ["Français", "Maths"],
  };
  
  export const docConfig = {
    "3e": {
      "Français": {
        "pdf": "/oqre/fr/F32015.pdf", // Path relative to public folder
        "googleForm": "https://docs.google.com/forms/d/e/1FAIpQLSe6ojinmm2JH_MGrPE74kjuEdL4m6xBzHK6QqrmzPG9mokcWA/viewform?embedded=true"
      },
      "Maths": {
        "pdf": "/oqre/Math/MATHS32015.pdf", // Path relative to public folder
        "googleForm": "https://docs.google.com/forms/d/e/1FAIpQLSc1qKBuG7gYvMvsl21AN-LemXyTgqja2iCOdH5uSID16gVa8Q/viewform?usp=header"
        
      }
    },
    "6e": {
      // --- Add configuration for 6e here ---
      "Français": {
          "pdf": "/oqre/fr/Fr62015.pdf", // Replace with actual 6e French PDF path
          "googleForm": "https://docs.google.com/forms/d/e/1FAIpQLSdKfTEn_SxRaVjJ_7GqXVdycdR3_5jVjmwBB3mFERKXhxWM6A/viewform"
        },
        "Maths": {
          "pdf": "/oqre/Math/MATHS62015.pdf", // Replace with actual 6e Maths PDF path
          "googleForm": ""
        }
    }
  };