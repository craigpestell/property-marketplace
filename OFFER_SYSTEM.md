# Offer Management System

The property marketplace now includes a comprehensive offer management system that allows buyers and sellers to facilitate property transactions.

## Features

### 🏠 **Property Offers**

- Buyers can make offers on any property they don't own
- Comprehensive offer form with financing details, contingencies, and terms
- Automatic validation to prevent self-offers

### 📊 **Offer Management**

- **Pending Offers**: New offers awaiting seller response
- **Accepted Offers**: Offers accepted by the seller
- **Rejected Offers**: Offers declined by the seller
- **Countered Offers**: Offers with seller counter-proposals
- **Withdrawn Offers**: Offers withdrawn by the buyer
- **Expired Offers**: Offers that exceeded the 72-hour deadline

### 🔄 **Offer Workflow**

1. **Buyer submits offer** with amount, financing, contingencies, closing date
2. **Seller receives notification** and can accept, reject, or counter
3. **Counter negotiations** can continue until agreement
4. **Final acceptance** leads to transaction facilitation

### 💰 **Offer Details**

- **Offer Amount**: Purchase price proposal
- **Financing Type**: Cash, Conventional, FHA, VA, Other
- **Earnest Money**: Good faith deposit amount
- **Contingencies**: Inspection, Financing, Appraisal, etc.
- **Closing Date**: Proposed settlement date
- **Inspection Period**: Days for buyer inspection

## Database Schema

### Tables Created

- **`offers`** - Main offer records with all terms and status
- **`counter_offers`** - Counter-offer negotiations
- **`offer_notifications`** - Notification system for all parties

### Sample Data

The database has been seeded with realistic test data:

- 6 offers across different properties
- Various statuses (pending, accepted, rejected, countered, withdrawn)
- 1 counter offer example
- 6 notifications for different offer events

## API Endpoints

### GET `/api/offers`

- List offers for authenticated user
- Filter by role: `?role=buyer` or `?role=seller`
- Filter by status: `?status=pending`

### POST `/api/offers`

- Submit new offer
- Requires: `property_uid`, `offer_amount`
- Optional: financing details, contingencies, terms

### GET `/api/offers/[id]`

- Get specific offer details
- Only accessible by buyer or seller

### PUT `/api/offers/[id]`

- Update offer status (accept/reject/counter/withdraw)
- Role-based permissions enforced

## User Interface

### `/offers` Page

- **Tab Navigation**: View all offers, offers made, offers received
- **Offer Cards**: Display all offer details and status
- **Action Buttons**: Accept, reject, counter, withdraw based on role
- **Counter Offer Form**: Inline form for negotiations

### Property Detail Pages

- **Make Offer Button**: Available for authenticated non-owners
- **Offer Form Modal**: Comprehensive form for new offers
- **Existing Offers**: Display current offers on property (seller view)

### Navigation

- **"My Offers"** link added to user dropdown menu
- Easy access from anywhere in the application

## Testing the System

### As a Seller (craigpestell@gmail.com)

1. Visit `/offers` to see all offers received
2. Filter by "Offers Received" tab
3. Accept, reject, or counter offers
4. View offer details and buyer messages

### As a Buyer

1. Browse properties at `/listings`
2. Click on any property to view details
3. Click "Make an Offer" button (when logged in)
4. Fill out comprehensive offer form
5. Visit `/offers` to track offer status

### Sample Test Data

- **Modern Family Home**: 2 pending offers ($427,500 and $445,000)
- **Downtown Apartment**: 1 accepted offer ($320,000)
- **Cozy Cottage**: 1 countered offer ($225,000 → $242,500)
- **Luxury Villa**: 1 rejected offer ($960,000)
- **Suburban House**: 1 withdrawn offer ($372,400)

## Next Steps

The foundation is now complete for transaction facilitation. Future enhancements could include:

1. **Email Notifications** - Send automated emails for offer events
2. **Document Management** - Upload contracts, inspections, appraisals
3. **E-Signature Integration** - DocuSign or Adobe Sign integration
4. **Payment Processing** - Handle earnest money deposits
5. **Real-time Chat** - Direct communication between parties
6. **Mobile Optimization** - Responsive design improvements
7. **Advanced Analytics** - Offer tracking and market insights

The offer system provides a solid foundation for facilitating real estate transactions while maintaining the platform's FSBO (For Sale By Owner) focus and 0.9% commission structure.
