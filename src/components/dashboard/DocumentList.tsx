"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  getDocuments,
  deleteDocument,
  sendReminder,
  cancelDocument,
  ReminderError,
} from "@/lib/api";
import { Document } from "@prisma/client";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit,
  MoreVertical,
  XCircle,
  Info,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import SuccessModal from "../modals/SuccessModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";


type DocumentWithSignatories = Document & {
  signatories: { id: string; userId: string | null; status: string }[];
};

const getStatus = (doc: DocumentWithSignatories, userId: string) => {
  switch (doc.status.toLowerCase()) {
    case "draft":
      return { text: "Draft", color: "gray", Icon: Edit };
    case "completed":
      return { text: "Completed", color: "green", Icon: CheckCircle };
    case "cancelled":
      return { text: "Cancelled", color: "red", Icon: XCircle };
    case "sent":
      const userSignatory = doc.signatories.find((s) => s.userId === userId);
      if (userSignatory && userSignatory.status.toLowerCase() === "pending") {
        return {
          text: "Signature Required",
          color: "orange",
          Icon: AlertTriangle,
        };
      }
      return { text: "Waiting for Others", color: "blue", Icon: Clock };
    default:
      return { text: "Unknown", color: "gray", Icon: AlertTriangle };
  }
};

const DocumentStatus: React.FC<{
  doc: DocumentWithSignatories;
  userId: string;
}> = ({ doc, userId }) => {
  const status = getStatus(doc, userId);

  const colorVariants: { [key: string]: string } = {
    gray: "text-gray-500 bg-gray-100",
    green: "text-green-600 bg-green-100",
    orange: "text-orange-600 bg-orange-100",
    blue: "text-blue-600 bg-blue-100",
    red: "text-red-600 bg-red-100",
    purple: "text-purple-600 bg-purple-100",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorVariants[status.color]}`}
    >
      <status.Icon className="w-4 h-4 mr-1.5" />
      {status.text}
    </span>
  );
};

const DocumentList: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentWithSignatories[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [actionToConfirm, setActionToConfirm] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");
  const [confirmButtonText, setConfirmButtonText] = useState("");
  const [redirectOnCloseId, setRedirectOnCloseId] = useState<string | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState("");

  const fetchDocuments = useCallback(async () => {
    if (status === "authenticated") {
      try {
        setLoading(true);
        const docs = await getDocuments();
        // sort documents by updatedAt date
        docs.sort(
          (a: DocumentWithSignatories, b: DocumentWithSignatories) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
        setDocuments(docs);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [status]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        openMenuId &&
        !(event.target as HTMLElement).closest(".menu-container")
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [openMenuId]);

  const handleDeleteConfirm = async (docId: string) => {
    try {
      await deleteDocument(docId);
      setDocuments((prevDocs) => prevDocs.filter((d) => d.id !== docId));
      setSuccessMessage("Le document a été supprimé avec succès.");
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Failed to delete document:", error);
      alert("Failed to delete document. See console for details.");
    }
  };

  const handleSendReminder = async (docId: string) => {
    setIsSendingReminder(true);
    setOpenMenuId(null); // Close menu first

    try {
      const result = await sendReminder(docId);
      setSuccessMessage(result.message);
      setRedirectOnCloseId(docId);
      setIsSuccessModalOpen(true);
    } catch (error) {
      if (error instanceof ReminderError) {
        setInfoModalMessage(error.message);
        setIsInfoModalOpen(true);
      } else {
        console.error("Failed to send reminders:", error);
        alert((error as Error).message);
      }
    } finally {
      setIsSendingReminder(false);
    }
  };

  const handleCancelRequest = (docId: string) => {
    setConfirmTitle("Êtes-vous sûr de vouloir annuler ce processus de signature ?");
    setConfirmDescription("Cette action mettra fin au processus de signature pour tous les signataires. Le document sera marqué comme annulé.");
    setConfirmButtonText("Annuler le document");
    setActionToConfirm(() => () => handleCancelConfirm(docId));
    setIsConfirmOpen(true);
    setOpenMenuId(null);
  };

  const handleCancelConfirm = async (docId: string) => {
    try {
      const result = await cancelDocument(docId);
      setSuccessMessage(result.message);
      setIsSuccessModalOpen(true);
      fetchDocuments(); // Re-fetch to update status
    } catch (error) {
      console.error("Failed to cancel document:", error);
      alert((error as Error).message);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    if (redirectOnCloseId) {
      router.push(`/dashboard/documents/${redirectOnCloseId}`);
      setRedirectOnCloseId(null); // Reset for next actions
    }
  };

  if (status === "loading") {
    return <div className="text-center p-10">Loading documents...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center p-10">
        Please log in to see your documents.
      </div>
    );
  }

  if (loading) {
    return <div className="text-center p-10">Loading documents...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        title="Succès"
        message={successMessage || "Opération réussie."}
      />

      <AlertDialog open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Info className="text-blue-500" />
              Information
            </AlertDialogTitle>
            <AlertDialogDescription>
              {infoModalMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsInfoModalOpen(false)}>
              Fermer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-red-500" />
              {confirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setActionToConfirm(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (actionToConfirm) {
                  actionToConfirm();
                }
                setIsConfirmOpen(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {confirmButtonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">My Documents</h2>
      </div>
      <div>
        {documents.length > 0 ? (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="group flex items-center justify-between p-4 border-b hover:bg-gray-50"
            >
              <Link
                href={`/dashboard/documents/${doc.id}`}
                className="flex-grow flex items-center"
              >
                <FileText className="w-6 h-6 mr-3 text-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    Last updated: {format(new Date(doc.updatedAt), "PPpp")}
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-4">
                <div className="group-hover:hidden">
                  <DocumentStatus
                    doc={doc}
                    userId={session?.user?.id || ""}
                  />
                </div>
                <div className="hidden group-hover:block relative menu-container">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === doc.id ? null : doc.id);
                    }}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                  {openMenuId === doc.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                      <ul className="py-1">
                        <li>
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                            onClick={() => handleSendReminder(doc.id)}
                            disabled={isSendingReminder}
                          >
                            {isSendingReminder ? "Envoi en cours..." : "Relancer les signataires"}
                          </button>
                        </li>
                        <li>
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleCancelRequest(doc.id)}
                          >
                            Annuler les signatures
                          </button>
                        </li>
                        {doc.status.toLowerCase() === "draft" && (
                          <>
                            <div className="border-t my-1"></div>
                            <li>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                onClick={() => {
                                  setConfirmTitle("Êtes-vous sûr de vouloir supprimer ce document ?");
                                  setConfirmDescription("Cette action est irréversible. Le document et toutes ses données associées seront définitivement supprimés.");
                                  setConfirmButtonText("Supprimer");
                                  setActionToConfirm(() => () => handleDeleteConfirm(doc.id));
                                  setIsConfirmOpen(true);
                                  setOpenMenuId(null);
                                }}
                              >
                                Supprimer
                              </button>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-10">
            <p>You have no documents yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;
