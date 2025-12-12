/**
 * Example page demonstrating agreement management
 */

import { useAgreements, useCreateAgreement, useUpdateAgreementStatus } from "../../query";
import { useAuthContext } from "../../context";
import type { CreateAgreementRequest } from "../../types";

export default function ExampleAgreementsPage() {
  const { user } = useAuthContext();
  const { data: agreementsData, isLoading } = useAgreements();
  const createAgreementMutation = useCreateAgreement();
  const updateStatusMutation = useUpdateAgreementStatus();

  const handleCreateAgreement = async () => {
    const newAgreement: CreateAgreementRequest = {
      client: user?._id || "",
      developer: "dev-id-123",
      gig: "gig-id-456",
      title: "New Website Development",
      description: "Build a modern website",
      financials: {
        totalValue: 5000,
      },
      milestones: [
        {
          name: "Design Phase",
          description: "Complete UI/UX design",
          status: "pending",
          previews: [],
          completedAt: null,
        },
        {
          name: "Development Phase",
          description: "Implement frontend and backend",
          status: "pending",
          previews: [],
          completedAt: null,
        },
      ],
    };

    try {
      const result = await createAgreementMutation.mutateAsync(newAgreement);
      console.log("Agreement created:", result);
    } catch (error) {
      console.error("Failed to create agreement:", error);
    }
  };

  const handleUpdateStatus = async (agreementId: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: agreementId, status: newStatus });
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (isLoading) {
    return <div>Loading agreements...</div>;
  }

  return (
    <div>
      <h1>Agreements</h1>
      
      <button onClick={handleCreateAgreement} disabled={createAgreementMutation.isPending}>
        {createAgreementMutation.isPending ? "Creating..." : "Create New Agreement"}
      </button>

      <div>
        {agreementsData?.agreements.map((agreement) => (
          <div key={agreement._id}>
            <h3>{agreement.title}</h3>
            <p>{agreement.description}</p>
            <p>Status: {agreement.status}</p>
            <p>Total: ${agreement.financials.totalValue}</p>
            <p>Released: ${agreement.financials.releasedAmount}</p>
            <p>Remaining: ${agreement.financials.remainingAmount}</p>
            
            <div>
              <h4>Milestones:</h4>
              {agreement.milestones.map((milestone: any, idx: number) => (
                <div key={idx}>
                  <p>{milestone.name}</p>
                  <p>Status: {milestone.status}</p>
                </div>
              ))}
            </div>

            <button onClick={() => handleUpdateStatus(agreement._id, "active")}>
              Activate Agreement
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
