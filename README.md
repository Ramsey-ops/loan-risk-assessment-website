# Loan Risk Assessment Website

A modern, responsive web application for assessing loan risk based on financial criteria. Built with HTML, CSS, and vanilla JavaScript.

## 📁 Project Structure

```
loan-risk-assessment-website/
├── index.html          # Main HTML file with form and layout
├── style.css           # Complete responsive styling
├── script.js           # Form validation and risk assessment logic
├── assets/             # Assets folder (for images/icons)
└── README.md          # This file
```

## ✨ Features

### 1. **Professional Banking-Style Homepage**
   - Modern dark blue financial theme
   - Floating animated background shapes
   - Engaging hero section with call-to-action

### 2. **Loan Assessment Form**
   - Full Name input
   - Monthly Income (currency)
   - Requested Loan Amount (currency)
   - Employment Status (dropdown: Employed, Self-employed, Part-time, Unemployed, Retired)
   - Credit History Score (300-850)
   - Real-time validation with error messages

### 3. **Dynamic Risk Assessment Algorithm**
   - **Low Risk**: Strong financial health, favorable approval conditions
   - **Medium Risk**: Acceptable profile, may require documentation
   - **High Risk**: Significant risk factors, profile improvement recommended

   **Risk Scoring Factors:**
   - Credit Score (40 points max)
   - Debt-to-Income Ratio (35 points max)
   - Employment Status (20 points max)
   - Loan-to-Income Ratio (5 points max)

### 4. **Comprehensive Results Display**
   - Risk category with visual indicator
   - Debt-to-Income Ratio calculation
   - Credit score category
   - Employment stability assessment
   - Personalized recommendation
   - Download report option

### 5. **Beautiful Responsive UI**
   - Mobile-first responsive design
   - Breakpoints for 480px, 768px, and 1200px
   - Smooth animations and transitions
   - Touch-friendly interface

### 6. **Modern Design Elements**
   - Gradient backgrounds
   - Smooth animations
   - Professional color scheme
   - Floating shapes and hover effects
   - Glassmorphism cards

## 🎨 Color Scheme

- **Primary Dark**: `#001f3f` (Dark Blue)
- **Primary Blue**: `#003d7a`
- **Secondary Blue**: `#0066cc`
- **Accent Blue**: `#0080ff`
- **Success Green**: `#00b848`
- **Warning Yellow**: `#ffa500`
- **Danger Red**: `#e74c3c`

## 🚀 How to Use

### 1. **Open in Browser**
```bash
# Simply open the index.html file in any modern web browser
# Right-click index.html → Open with → Your preferred browser
```

### 2. **Fill the Assessment Form**
   - Enter your full name (minimum 3 characters)
   - Input your monthly income in dollars
   - Specify your desired loan amount (must be > 0)
   - Select your employment status
   - Enter your credit score (between 300-850)

### 3. **Automatic Validation**
   - Required fields validation
   - Real-time feedback on blur
   - Error messages for invalid inputs
   - Input range constraints

### 4. **Get Your Assessment**
   - Click "Calculate Risk Assessment" button
   - Instant risk evaluation
   - Detailed financial metrics
   - Personalized recommendation

### 5. **Download Results**
   - View detailed results section
   - Download assessment report as text file
   - Assess again with new information

## 📊 Risk Assessment Algorithm

### Risk Score Calculation

**Credit Score (0-40 points):**
- Excellent (740+): 0 points
- Good (670-739): 10 points
- Fair (580-669): 25 points
- Poor (<580): 35 points

**Debt-to-Income Ratio (0-35 points):**
- Excellent (≤20%): 0 points
- Good (20-36%): 15 points
- Fair (36-50%): 25 points
- Poor (>50%): 35 points

**Employment Status (0-20 points):**
- Employed (Full-time): 0 points
- Retired: 8 points
- Self-employed: 10 points
- Part-time: 15 points
- Unemployed: 20 points

**Loan-to-Income Ratio (0-5 points):**
- ≤300%: 0 points
- 300-400%: 2 points
- >400%: 5 points

### Final Risk Classification:
- **Low Risk**: Score ≤ 25
- **Medium Risk**: Score 26-50
- **High Risk**: Score > 50

## 🔒 Security & Privacy

- All calculations are performed locally in your browser
- No data is sent to external servers
- Form inputs are validated client-side
- No cookies or tracking implemented

## 🌐 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ⚙️ Technical Details

### HTML Features
- Semantic HTML5 structure
- Accessible form elements
- Responsive meta viewport
- Organized sections

### CSS Features
- CSS Grid and Flexbox
- CSS Variables for theming
- Media queries for responsiveness
- CSS animations and transitions
- Linear gradients
- Box shadows and effects
- Accessibility considerations (prefers-reduced-motion)

### JavaScript Features
- Form validation
- Event listeners
- Complex risk assessment algorithm
- Dynamic DOM manipulation
- Local calculations
- Smooth scrolling
- File download functionality
- Error handling

## 📱 Responsive Breakpoints

- **Desktop (1200px+)**: Full 2-column layout
- **Tablet (769px-1199px)**: Optimized spacing
- **Mobile (480px-768px)**: Single column, adjusted font sizes
- **Small Mobile (<480px)**: Minimal padding, touch-friendly buttons

## 🎯 Key Functionalities

### Form Submission
```javascript
- Validates all fields
- Calculates risk score
- Displays results
- Prevents page reload
```

### Real-time Validation
```javascript
- Validates on blur
- Clears errors on focus
- Format enforcement
- Range constraints
```

### Result Display
```javascript
- Smooth transitions
- Dynamic risk indicators
- Detailed metrics breakdown
- Personalized recommendations
```

### Download Feature
```javascript
- Generates text report
- Includes timestamp
- Professional formatting
- Browser-based download
```

## 🛠️ Customization

### Change Colors
Edit CSS variables in `style.css`:
```css
:root {
    --primary-dark: #001f3f;
    --primary-blue: #003d7a;
    /* ... more variables ... */
}
```

### Adjust Risk Thresholds
Modify the calculation function in `script.js`:
```javascript
function calculateRiskAssessment() {
    // Adjust scoring weights here
}
```

### Add New Fields
1. Add input in `index.html`
2. Add styling in `style.css`
3. Add validation in `script.js`
4. Include in risk calculation

## 📈 Future Enhancements

- [ ] Backend integration for data storage
- [ ] User authentication
- [ ] Historical assessment tracking
- [ ] PDF report generation
- [ ] Email sending capability
- [ ] Database for applicants
- [ ] Admin dashboard
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Advanced analytics

## 📝 Notes

- The assessment is for demonstration purposes
- Not a substitute for professional financial advice
- Credit score should be based on official credit bureaus
- Actual loan approval requires proper verification

## 🤝 Support

For issues or questions, review the JavaScript console for any errors or validation messages.

## 📄 License

This project is free to use and modify for personal and commercial purposes.

---

**Version**: 1.0
**Created**: 2026
**Last Updated**: May 17, 2026
