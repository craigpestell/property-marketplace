# Test Data Reference Guide

This guide provides information about the test users and properties created for the Property Marketplace.

## 🔑 Test User Accounts

All test accounts use the password: **`password123`**

### Buyers

- **Emily Rodriguez** - `buyer1@example.com`
- **Michael Chen** - `buyer2@example.com`

### Sellers

- **Sarah Thompson** - `seller1@example.com` (owns 3 properties)
- **David Williams** - `seller2@example.com` (owns 3 properties)

### Agent

- **Lisa Martinez** - `agent1@example.com` (owns 2 properties)

## 🏠 Test Properties

### Sarah Thompson's Properties (`seller1@example.com`)

1. **Stunning Victorian Family Home** - `$485,000`
   - 4 bed, 3 bath, 2,400 sqft
   - 1847 Maple Avenue, Springfield, IL
   - _Has pending offer from Emily_

2. **Modern Downtown Loft** - `$275,000`
   - 2 bed, 2 bath, 1,100 sqft
   - 312 State Street Unit 4B, Springfield, IL
   - _Accepted offer from Michael_

3. **Charming Cottage Retreat** - `$195,000`
   - 2 bed, 1 bath, 900 sqft
   - 856 Oak Hill Drive, Springfield, IL
   - _Counter offer pending with Emily_

### David Williams's Properties (`seller2@example.com`)

4. **Luxury Executive Estate** - `$850,000`
   - 5 bed, 4 bath, 4,200 sqft
   - 2905 Country Club Lane, Springfield, IL
   - _Has pending offer from Michael_

5. **Cozy Suburban Ranch** - `$320,000`
   - 3 bed, 2 bath, 1,650 sqft
   - 1523 Elmwood Court, Springfield, IL
   - _Rejected offer from Emily_

6. **Urban Townhouse** - `$395,000`
   - 3 bed, 2 bath, 1,800 sqft
   - 487 Lincoln Park Row, Springfield, IL
   - _Withdrawn offer from Michael_

### Lisa Martinez's Properties (`agent1@example.com`)

7. **Investment Duplex** - `$225,000`
   - 4 bed, 2 bath, 1,600 sqft (Multi-family)
   - 742 Jefferson Street, Springfield, IL

8. **Renovated Bungalow** - `$165,000`
   - 2 bed, 1 bath, 1,000 sqft
   - 1089 Birch Street, Springfield, IL

## 📋 Sample Offers Status

| Property         | Buyer   | Status    | Amount              | Details                              |
| ---------------- | ------- | --------- | ------------------- | ------------------------------------ |
| Victorian Home   | Emily   | Pending   | $465,000            | Conventional loan, 14-day inspection |
| Executive Estate | Michael | Pending   | $825,000            | Conventional loan, 10-day inspection |
| Cottage Retreat  | Emily   | Countered | $185,000 → $198,000 | FHA loan, counter offer pending      |
| Downtown Loft    | Michael | Accepted  | $270,000            | Cash offer, 7-day inspection         |
| Suburban Ranch   | Emily   | Rejected  | $295,000            | Conventional loan                    |
| Urban Townhouse  | Michael | Withdrawn | $380,000            | Conventional loan                    |

## 🧪 Testing Scenarios

### As a Buyer (Emily or Michael):

1. **Browse Properties**: Visit `/listings` to see all available properties
2. **Make Offers**: Click on properties you don't own and submit offers
3. **Manage Offers**: Visit `/offers` to see your submitted offers
4. **Respond to Counters**: Accept or reject counter offers

### As a Seller (Sarah or David):

1. **View Received Offers**: Visit `/offers` and click "Offers Received" tab
2. **Manage Offers**: Accept, reject, or counter incoming offers
3. **Add Properties**: Create new listings for sale

### As an Agent (Lisa):

1. **Manage Portfolio**: View and manage investment properties
2. **Track Market**: Monitor offers and pricing trends

## 🔄 Offer Workflow Testing

1. **Log in as Emily** (`buyer1@example.com`)
   - View the pending counter offer for the Cottage
   - Accept or reject the $198,000 counter offer

2. **Log in as Sarah** (`seller1@example.com`)
   - Review pending offer for Victorian Home
   - Accept, reject, or counter Emily's $465,000 offer

3. **Log in as Michael** (`buyer2@example.com`)
   - Check status of accepted Downtown Loft offer
   - Review pending offer for Executive Estate

## 🛠️ Database Setup

To set up this test data:

```bash
# Method 1: Use the setup script
export DATABASE_URL='postgresql://username:password@localhost:5432/property_marketplace'
./setup_database.sh

# Method 2: Run SQL files manually
psql $DATABASE_URL -f database_schema.sql
psql $DATABASE_URL -f offers_schema.sql
psql $DATABASE_URL -f seed_users_and_properties.sql
```

## 📊 Verification Queries

Check that everything was created correctly:

```sql
-- Count test data
SELECT 'Users' as type, COUNT(*) FROM clients WHERE email LIKE '%@example.com';
SELECT 'Properties' as type, COUNT(*) FROM properties WHERE property_uid LIKE 'SEED-%';
SELECT 'Offers' as type, COUNT(*) FROM offers WHERE property_uid LIKE 'SEED-%';

-- View all test users
SELECT name, email FROM clients WHERE email LIKE '%@example.com' ORDER BY email;

-- View all test properties
SELECT title, price, user_email FROM properties WHERE property_uid LIKE 'SEED-%' ORDER BY price;

-- View offer summary
SELECT p.title, o.buyer_email, o.offer_amount, o.status
FROM offers o
JOIN properties p ON p.property_uid = o.property_uid
WHERE o.property_uid LIKE 'SEED-%'
ORDER BY o.created_at;
```

This comprehensive test data set provides realistic scenarios for testing all aspects of the offer management system!
