# Mobile-Computing-Project

## Expo Link: https://snack.expo.dev/@skazka/harvest-hub2?platform=web


### Project Colors
```
CopyPrimary: #4CAF50 (Green)
Secondary: #FF9800 (Orange)
Neutral: #F5F5F5 (Light Gray)
Text: #333333 (Dark Gray)
```
### Project Fonts
```
Title: Roboto-Bold
Header: Roboto-Medium
Regular: Roboto-Regular
Bold: Roboto-Bold
```

### Interactions:

```mermaid
flowchart TD
    Welcome[Welcome Screen] --> |Login| Login[Login Screen]
    Welcome --> |Sign Up| SignUp[Sign Up Screen]
    Welcome --> |Browse as Guest| Home[Home Screen]
    
    Login --> Home
    SignUp --> Home
    
    Home --> |Product Card Click| ProductDetail[Product Detail Screen]
    Home --> |Search| Home
    Home --> |Category Filter| Home
    Home --> |Cart Icon| Cart[Cart Screen]
    Home --> |Explore Tab| Explore[Explore Screen]
    Home --> |Farms Tab| Farms[Farms Screen]
    Home --> |Profile Tab| Profile[Profile Screen]
    
    ProductDetail --> |Add to Cart| Cart
    ProductDetail --> |Back| Home
    
    Cart --> |Checkout| Checkout[Checkout Screen]
    Cart --> |Continue Shopping| Home
    
    Checkout --> |Payment| Payment[Payment Screen]
    Payment --> |Success| OrderConfirmation[Order Confirmation]
    
    OrderConfirmation --> Home
    
    Profile --> |Order History| OrderHistory[Order History]
    Profile --> |Settings| Settings[Settings Screen]
    Profile --> |Edit Profile| EditProfile[Edit Profile Screen]
    
    Farms --> |Farm Detail| FarmDetail[Farm Detail Screen]
    FarmDetail --> |Product| ProductDetail
    
    subgraph "Main Navigation"
        Home
        Explore
        Farms
        Profile
    end
    
    style Welcome fill:#f9f9f9,stroke:#4CAF50,stroke-width:2px
    style Home fill:#f9f9f9,stroke:#4CAF50,stroke-width:2px
    style ProductDetail fill:#f9f9f9,stroke:#4CAF50,stroke-width:2px
    style Cart fill:#f9f9f9,stroke:#FF9800,stroke-width:2px
```
