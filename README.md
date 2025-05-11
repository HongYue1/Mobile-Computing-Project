# Mobile-Computing-Project

## Expo Link: SOON


### Project Colors
```
  primary: "#03A791",
  secondary: "#FFFFFF",
  neutral: "gray",
  neutral2: "#F2F3F2",
  text: "#333333",
  error: "#FF3B30",
  success: "#4CD964",
  warning: "#FF9500",
  shadow: "rgba(0, 0, 0, 0.1)",
```
### Project Fonts
```
Splash screen: Delius-Regular.ttf
Splash screen: Pacifico-Regular.ttf
Titles: Lato-Bold.ttf
Regular text: Lato-Regular.ttf
```

### Interactions:

```mermaid
flowchart TD
    %% Simple print-friendly flowchart with essential paths only
    %% Use minimal colors and simpler connections

    %% --- Authentication Flow ---
    A[Splash Screen] --> B{Auth Check}
    B -- "Authenticated" --> HT
    B -- "Not Authenticated" --> LoginScreen
    
    LoginScreen -- "Login Success" --> HT
    LoginScreen -- "To Signup" --> SignupScreen
    SignupScreen -- "Signup Success" --> LoginScreen
    SignupScreen -- "To Login" --> LoginScreen
    
    %% --- Main Navigation Structure ---
    HT[Home Tab] --- LT[Locations Tab]
    LT --- CT[Cart Tab]
    CT --- PT[Profile Tab]
    
    %% --- Home Tab Core Interactions ---
    HT -- "Product Click" --> DetailsScreen
    HT -- "See All" --> ProductListScreen
    ProductListScreen -- "Product Click" --> DetailsScreen
    
    %% --- Details Screen Core Interactions ---
    DetailsScreen -- "Add to Cart" --> DetailsScreen
    DetailsScreen -- "Back" --> HT
    DetailsScreen -- "View Cart" --> CT
    
    %% --- Cart Tab Core Interactions ---
    CT -- "Empty Cart" --> HT
    CT -- "Checkout" --> CheckoutScreen
    
    %% --- Checkout Flow Core ---
    CheckoutScreen -- "Place Order" --> OrderConfirmScreen
    CheckoutScreen -- "Back to Cart" --> CT
    
    OrderConfirmScreen -- "Continue Shopping" --> HT
    OrderConfirmScreen -- "View Orders" --> OrderHistoryScreen
    
    %% --- Profile Tab Core Interactions ---
    PT -- "View Orders" --> OrderHistoryScreen
    PT -- "Edit Profile" --> ProfileScreen
    PT -- "Logout" --> LoginScreen
    
    %% --- Location Tab Core ---
    LT -- "Select Location" --> StoreDetailsScreen
    
    %% Minimal styling focused on clarity for print
    classDef default fill:white,stroke:#333,stroke-width:1px;
    classDef tab fill:white,stroke:#333,stroke-width:2px,font-weight:bold;
    classDef decision fill:white,stroke:#333,stroke-width:1px,stroke-dasharray: 5 5;
    
    class HT,LT,CT,PT tab;
    class B decision;
```
