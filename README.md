# Onboarding Widget

A React-based onboarding widget for Zoho CRM that guides users through a 4-step setup process for healthcare organizations.

## Features

- **4-Step Onboarding Process**: 
  1. Add Your Doctors
  2. Set up your specialties
  3. Create departments
  4. List your products

- **Progress Tracking**: Visual progress bar showing completion status
- **Interactive Cards**: Clickable cards that integrate with Zoho CRM
- **Single User Mode**: Checkbox for single-user organizations
- **Responsive Design**: Works on desktop and mobile devices
- **Zoho CRM Integration**: Full integration with Zoho CRM APIs

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Add Images**: Place your onboarding images in the `public/assets/` folder:
   - `doctors.png`
   - `Specialities.png`
   - `departments.png`
   - `Products.png`

3. **Zoho CRM Configuration**: Ensure your Zoho CRM environment has:
   - The Zoho Embedded App SDK loaded
   - Required CRM functions configured
   - Proper user permissions

## Usage

### Starting the Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## Component Structure

### Main App Component (`src/App.jsx`)
- Manages the overall state of the onboarding process
- Handles Zoho CRM integration
- Controls step navigation and progress tracking

### Key Features

#### State Management
- `currentStep`: Tracks the current step (1-4)
- `completedSteps`: Count of completed steps
- `isSingleUser`: Single user organization flag
- `onboardingData`: Data received from Zoho CRM
- `isLoading`: Loading state management

#### Zoho CRM Integration
- **User Authentication**: Gets current user information
- **CRM Functions**: Executes custom CRM functions for data persistence
- **Organization Variables**: Manages single user and completion flags

#### Navigation
- **Next Button**: Advances to the next step or completes onboarding
- **Back Button**: Returns to the previous step
- **Card Clicks**: Opens corresponding Zoho CRM sections

## Styling

The widget uses a comprehensive CSS system (`src/App.css`) with:

- **Progress Bar**: Visual step indicator with completion states
- **Card Layout**: Responsive grid layout for onboarding steps
- **Color Themes**: Different colors for each step category
- **Hover Effects**: Interactive elements with smooth transitions
- **Mobile Responsive**: Adapts to different screen sizes

## Zoho CRM Functions

The widget requires these CRM functions to be configured:

1. **pms_setorgvariables_1**: Sets organization variables
   - `SINGLE_USER_ORG`: Manages single user mode
   - `IS_ONBOARD_COMPLETED`: Tracks completion status

## Data Flow

1. **Initialization**: App loads and initializes Zoho CRM connection
2. **Data Loading**: Receives onboarding data from CRM
3. **Progress Calculation**: Determines completed steps
4. **User Interaction**: Handles navigation and form submissions
5. **Data Persistence**: Saves changes back to CRM

## Customization

### Adding New Steps
1. Update the `totalSteps` constant
2. Add new card component in the JSX
3. Update progress bar mapping
4. Add corresponding CRM data handling

### Styling Changes
- Modify `src/App.css` for visual changes
- Update color schemes in the CSS variables
- Adjust responsive breakpoints as needed

### CRM Integration
- Add new CRM functions as needed
- Update the `executeCRMFunction` method
- Modify data mapping for new fields

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- React 18+
- Zoho Embedded App SDK
- Vite (for development)

## License

This project is designed for use with Zoho CRM and follows Zoho's development guidelines.
