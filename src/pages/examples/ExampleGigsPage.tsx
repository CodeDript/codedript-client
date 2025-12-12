/**
 * Example page demonstrating API integration usage
 * 
 * This file shows how to use the API hooks in your components.
 * You can copy patterns from here to implement in your actual pages.
 */

import { useGigs, useGig } from "../../query";
import { useAuthContext } from "../../context";

export default function ExampleGigsPage() {
  const { user, isAuthenticated } = useAuthContext();
  
  // Fetch all gigs
  const { data: gigsData, isLoading, error } = useGigs();

  // Fetch a specific gig (example with ID)
  const { data: gigData } = useGig("123");

  if (!isAuthenticated) {
    return <div>Please login to view gigs</div>;
  }

  if (isLoading) {
    return <div>Loading gigs...</div>;
  }

  if (error) {
    return <div>Error loading gigs: {error.message}</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.fullname}!</h1>
      
      <h2>All Gigs</h2>
      <div>
        {gigsData?.gigs.map((gig) => (
          <div key={gig._id}>
            <h3>{gig.title}</h3>
            <p>{gig.description}</p>
            {gig.packages.map((pkg, idx) => (
              <div key={idx}>
                <h4>{pkg.name}</h4>
                <p>Price: ${pkg.price}</p>
                <p>Delivery: {pkg.deliveryTime} days</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {gigData && (
        <div>
          <h2>Featured Gig</h2>
          <h3>{gigData.gig.title}</h3>
          <p>{gigData.gig.description}</p>
        </div>
      )}
    </div>
  );
}
