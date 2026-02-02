# Raqam - Design Guidelines

## 1. Brand Identity

**Purpose**: Raqam is a premium marketplace connecting buyers and sellers of distinguished car plates and mobile numbers in Arabic markets.

**Aesthetic Direction**: Luxurious Editorial
- Premium yet approachable marketplace feel
- Modern Arabic sophistication (not traditional/ornate)
- Editorial typography with breathing room
- Refined metallics and deep jewel tones
- Intentional whitespace creates prestige

**Memorable Element**: Subtle metallic gold accents throughout the app signal premium value - not loud, but unmistakably luxurious. Combined with Arabic-first layout (RTL support) and generous whitespace.

## 2. Navigation Architecture

**Root Navigation**: Tab Bar (3 tabs)

**Tabs**:
1. **Home** (Explore icon) - Browse marketplace listings
2. **Sell** (Plus icon, center position) - Create new listing
3. **Profile** (Person icon) - Account, my listings, settings

**Auth Flow**: Required
- Apple Sign-In (iOS primary)
- Google Sign-In (cross-platform)
- Phone number verification (optional secondary, common in Arabic markets)

## 3. Screen-by-Screen Specifications

### Authentication Screens (Stack-Only)

**Welcome Screen**
- Full-screen hero illustration with app logo
- Tagline in Arabic and English
- Sign-in buttons at bottom (Apple, Google)
- Privacy policy and terms links (small text)
- Safe area: top insets.top + Spacing.xl, bottom insets.bottom + Spacing.xl

**Phone Verification** (if user chooses phone sign-in)
- Simple form with country code selector and phone input
- OTP verification screen follows
- Header with back button

### Home Tab Stack

**Explore Screen**
- Transparent header with "رقم Raqam" title, search icon (right), filter icon (left)
- Safe area: top headerHeight + Spacing.xl
- Scrollable content with sections:
  - Featured listings (horizontal scroll cards)
  - Categories (Car Plates / Mobile Numbers toggle filter)
  - All listings (vertical grid, 2 columns)
- Empty state: "No listings available" with illustration
- Safe area bottom: tabBarHeight + Spacing.xl

**Search Screen** (modal)
- Search bar in header (autofocus on open)
- Filter chips below search (Price range, Category, Type)
- Results in grid below
- Clear all filters button

**Listing Detail Screen** (pushed)
- Custom header: transparent, back button (left), share + favorite icons (right)
- Scrollable content:
  - Large number display (hero text, centered)
  - Price (prominent, gold accent)
  - Seller info card
  - Description
  - Specifications (category, type, location)
  - Contact seller button (floating at bottom)
- Safe area top: headerHeight + Spacing.xl
- Safe area bottom: insets.bottom + Spacing.xl + 60 (for floating button)

### Sell Tab Stack

**Create Listing Screen**
- Default header with "Create Listing" title, cancel (left), post (right - disabled until valid)
- Scrollable form:
  - Category selector (Car Plate / Mobile Number)
  - Number input (large, validated format)
  - Price input (numeric, currency formatted)
  - Description textarea
  - Location selector
  - Images upload (optional, up to 3)
- Submit in header (enabled when form valid)
- Safe area: top Spacing.xl, bottom tabBarHeight + Spacing.xl

**Success Screen** (modal after posting)
- Checkmark illustration
- "Listing Posted Successfully" message
- View listing / Post another buttons

### Profile Tab Stack

**Profile Screen**
- Custom header: transparent, settings icon (right)
- Safe area top: headerHeight + Spacing.xl
- Scrollable content:
  - User avatar and name (editable)
  - Stats cards (Active listings, Sold, Favorites)
  - My Listings section (tabs: Active, Sold, Drafts)
  - Empty state for each tab with illustration
- Safe area bottom: tabBarHeight + Spacing.xl

**Settings Screen** (pushed)
- Default header with "Settings" title
- Scrollable list:
  - Account (edit profile, change language AR/EN, notifications)
  - Preferences (currency, location)
  - Support (Help center, Contact us)
  - Legal (Terms, Privacy)
  - Account deletion (nested: Settings > Account > Delete Account)
  - Log out button (at bottom, destructive style)

**Edit Profile Screen** (pushed)
- Default header with "Edit Profile", cancel (left), save (right)
- Form: avatar picker, display name, bio, location
- Submit in header

## 4. Color Palette

**Primary**: #C89F5D (Muted gold - prestige without flash)
**Primary Dark**: #A67F3D (for pressed states)

**Background**: #FAFAF8 (warm off-white)
**Surface**: #FFFFFF (card backgrounds)
**Surface Elevated**: #FFFFFF with subtle shadow

**Text Primary**: #1A1614 (warm black)
**Text Secondary**: #6B6662 (warm gray)
**Text Tertiary**: #9E9893 (light warm gray)

**Semantic**:
- Success: #2D7A3E (deep green)
- Error: #C43E3E (deep red)
- Warning: #D89F3D (amber gold)

**Accent**: #2D3E50 (deep blue-gray for CTAs secondary to gold)

## 5. Typography

**Primary Font**: Tajawal (Google Font - designed for Arabic, clean modern sans-serif)
**Secondary Font**: Inter (for numbers/English, pairs well)

**Type Scale**:
- Hero: Tajawal Bold 32/40
- Title: Tajawal Bold 24/32
- Headline: Tajawal Semibold 20/28
- Body: Tajawal Regular 16/24
- Caption: Tajawal Regular 14/20
- Small: Tajawal Regular 12/16

**Number Display** (for listings): Inter Bold 48/56 (numbers are universal)

## 6. Visual Design

**Icons**: Feather icons from @expo/vector-icons
**Touchable Feedback**: 0.7 opacity on press for all touchables
**Shadows**: Floating buttons only - shadowOffset {width: 0, height: 2}, shadowOpacity 0.10, shadowRadius 2
**Card Style**: White background, 12px radius, subtle border (1px, #E8E6E4)
**RTL Support**: Full right-to-left layout support for Arabic

## 7. Assets to Generate

**icon.png** - App icon featuring stylized Arabic numerals in gold on deep background
WHERE USED: Device home screen

**splash-icon.png** - Simplified version of app icon
WHERE USED: App launch screen

**welcome-hero.png** - Elegant illustration showing car plate and mobile number in refined, minimal style with gold accents
WHERE USED: Welcome/authentication screen hero

**empty-listings.png** - Minimal illustration of empty marketplace/storefront
WHERE USED: Home screen when no listings available

**empty-favorites.png** - Minimal illustration of empty bookmark/heart
WHERE USED: Profile favorites when none saved

**empty-my-listings.png** - Minimal illustration of empty clipboard/document
WHERE USED: Profile my listings when none posted

**success-post.png** - Checkmark with subtle celebration elements
WHERE USED: Success modal after creating listing

**avatar-default.png** - Elegant circular avatar placeholder with Arabic initial pattern
WHERE USED: User profile default avatar

All illustrations should use warm off-white background (#FAFAF8) with gold (#C89F5D) and deep blue-gray (#2D3E50) as primary colors. Style: refined, minimal, editorial - avoid busy details.