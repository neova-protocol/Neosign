"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSignature } from "@/contexts/SignatureContext";
import {
  getDocumentById,
  deleteDocument,
  sendReminder,
  cancelDocument,
  ReminderError,
} from "@/lib/api";
import { Document as AppDocument, Signatory, DocumentEvent } from "@/types";
import {
  FileText,
  Download,
  CheckCircle,
  Users,
  Clock,
  Edit,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  Info,
  RefreshCw,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import SuccessModal from "@/components/modals/SuccessModal";
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


// This will be a new component we create
const DocumentTimeline = ({ events }: { events: DocumentEvent[] }) => (
  <div className="mt-8">
    <h3 className="text-lg font-semibold mb-4">Activity</h3>
    <div className="border-l-2 border-gray-300 pl-4">
      {events
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((event: DocumentEvent) => (
          <div key={event.id} className="mb-4 relative">
            <div className="absolute -left-5 w-4 h-4 bg-gray-300 rounded-full"></div>
            <p className="font-semibold text-gray-700 capitalize">
              {event.type.replace("_", " ")}
            </p>
            <p className="text-sm text-gray-500">{event.userName}</p>
            <p className="text-xs text-gray-400">
              {new Date(event.date).toLocaleString()}
            </p>
          </div>
        ))}
    </div>
  </div>
);

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const documentId = params.documentId as string;
  const { } = useSignature();
  const [localDocument, setLocalDocument] = useState<AppDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");
  const [confirmButtonText, setConfirmButtonText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState("");


  const fetchDocument = useCallback(async () => {
    if (documentId) {
      setIsLoading(true);
      try {
        const doc = await getDocumentById(documentId);
        setLocalDocument(doc);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [documentId]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  const handleDeleteConfirm = async () => {
    if (!localDocument) return;

    try {
      await deleteDocument(localDocument.id);
      setIsConfirmOpen(false); // Close confirmation dialog
      setIsSuccessModalOpen(true); // Open success modal
    } catch (error) {
      console.error("Failed to delete document:", error);
      alert("Failed to delete document.");
    }
  };

  const handleSendReminder = async () => {
    if (!localDocument) return;
    setIsSendingReminder(true);
    try {
      const result = await sendReminder(localDocument.id);
      setSuccessMessage(result.message);
      setIsSuccessModalOpen(true);
      fetchDocument(); // Refresh activity
    } catch (error) {
      if (error instanceof ReminderError) {
        setInfoModalMessage(error.message);
        setIsInfoModalOpen(true);
      } else {
        alert((error as Error).message);
      }
    } finally {
      setIsSendingReminder(false);
    }
  };
  
  const handleCancelRequest = () => {
    setConfirmTitle("Êtes-vous sûr de vouloir annuler ce processus de signature ?");
    setConfirmDescription("Cette action mettra fin au processus de signature pour tous les signataires. Le document sera marqué comme annulé.");
    setConfirmButtonText("Annuler le document");
    setActionToConfirm(() => handleCancelConfirm);
    setIsConfirmOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!localDocument) return;
    try {
      const result = await cancelDocument(localDocument.id);
      setSuccessMessage(result.message);
      setIsSuccessModalOpen(true);
      fetchDocument(); // Refresh status
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    // No redirection needed here, just close
  };

  if (isLoading) {
    return <div className="p-8">Loading document details...</div>;
  }

  if (!localDocument) {
    return <div className="p-8">Document not found.</div>;
  }

  const { name, status, signatories, events } = localDocument;

  const selfAsSignatory = session?.user
    ? signatories.find((s: Signatory) => s.userId === session.user!.id)
    : null;
  const canSign = selfAsSignatory && selfAsSignatory.status === "pending";
  const isCreator = session?.user?.id === localDocument.creatorId;
  const isActionable = status.toLowerCase() === 'sent';

  const getStatusIcon = (docStatus: string) => {
    switch (docStatus.toLowerCase()) {
      case "completed":
        return <CheckCircle className="text-green-500" />;
      case "sent":
        return <Clock className="text-yellow-500" />;
      default:
        return <Users className="text-gray-500" />;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseModal}
        title="Succès"
        message={successMessage}
      />
      <AlertDialog open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Info className="text-blue-500" />
              Information
            </AlertDialogTitle>
            <AlertDialogDescription>{infoModalMessage}</AlertDialogDescription>
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
      
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <button
            onClick={() => router.push("/dashboard/sign")}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Sign
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
              <div className="flex items-center gap-2 mt-2 capitalize">
                {getStatusIcon(status)}
                <span
                  className={`font-semibold ${status === "completed" ? "text-green-500" : "text-gray-600"}`}
                >
                  {status}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {isCreator && isActionable && (
                <>
                  <button
                    onClick={handleSendReminder}
                    className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 flex items-center gap-2 disabled:opacity-50"
                    disabled={isSendingReminder}
                  >
                    <RefreshCw size={18} className={isSendingReminder ? "animate-spin" : ""} />
                    {isSendingReminder ? "Relance..." : "Relancer"}
                  </button>
                  <button
                    onClick={handleCancelRequest}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center gap-2"
                  >
                    <XCircle size={18} /> Annuler
                  </button>
                </>
              )}
              {isCreator && localDocument.status.toLowerCase() === "draft" && (
                <>
                  <Link
                    href={`/dashboard/sign/edit/${documentId}`}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 flex items-center gap-2"
                  >
                    <Edit size={18} /> Resume Editing
                  </Link>
                  <button
                    onClick={() => {
                      setConfirmTitle("Êtes-vous sûr de vouloir supprimer ce brouillon ?");
                      setConfirmDescription("Cette action est irréversible. Le document et toutes ses données associées seront définitivement supprimés.");
                      setConfirmButtonText("Supprimer le brouillon");
                      setActionToConfirm(() => handleDeleteConfirm);
                      setIsConfirmOpen(true);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center gap-2"
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                </>
              )}
              {canSign && (
                <Link
                  href={`/dashboard/sign/document/${documentId}`}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2"
                >
                  <Edit size={18} /> Sign Document
                </Link>
              )}
              <a
                href={localDocument.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
              >
                <FileText size={18} /> View
              </a>
              <a
                href={`/api/documents/${documentId}/download`}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
              >
                <Download size={18} /> Download
              </a>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <DocumentTimeline events={events} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Signatories</h3>
              
              {/* Statistiques de signature */}
              {localDocument.status === 'completed' && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Statistiques de signature</h4>
                  <div className="space-y-2 text-xs">
                    {(() => {
                      const signatureTypes = signatories.map(s => {
                        const signatoryFields = localDocument.fields.filter(f => f.signatoryId === s.id);
                        return signatoryFields.length > 0 ? signatoryFields[0].signatureType : 'simple';
                      });
                      
                      const aesCount = signatureTypes.filter(type => type === 'aes').length;
                      const sesCount = signatureTypes.filter(type => type === 'ses').length;
                      const simpleCount = signatureTypes.filter(type => type === 'simple').length;
                      
                      return (
                        <>
                          {aesCount > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-yellow-700">Signatures AES:</span>
                              <span className="font-medium">{aesCount}</span>
                            </div>
                          )}
                          {sesCount > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-blue-700">Signatures SES:</span>
                              <span className="font-medium">{sesCount}</span>
                            </div>
                          )}
                          {simpleCount > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700">Signatures simples:</span>
                              <span className="font-medium">{simpleCount}</span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {signatories.map((s: Signatory) => {
                  // Trouver les champs de signature pour ce signataire
                  const signatoryFields = localDocument.fields.filter(f => f.signatoryId === s.id);
                  const signatureType = signatoryFields.length > 0 ? signatoryFields[0].signatureType : 'simple';
                  
                  const getSignatureTypeLabel = (type: string) => {
                    switch (type) {
                      case 'simple':
                        return 'Signature Simple';
                      case 'ses':
                        return 'SES - Simple Electronic Signature';
                      case 'aes':
                        return 'AES - Advanced Electronic Signature';
                      case 'qes':
                        return 'QES - Qualified Electronic Signature';
                      default:
                        return 'Signature Simple';
                    }
                  };

                  const getSignatureTypeColor = (type: string) => {
                    switch (type) {
                      case 'simple':
                        return 'bg-gray-100 text-gray-800';
                      case 'ses':
                        return 'bg-blue-100 text-blue-800';
                      case 'aes':
                        return 'bg-yellow-100 text-yellow-800';
                      case 'qes':
                        return 'bg-green-100 text-green-800';
                      default:
                        return 'bg-gray-100 text-gray-800';
                    }
                  };

                  return (
                    <div key={s.id} className="p-4 border rounded-md">
                      <p className="font-bold">{s.name}</p>
                      <p className="text-sm text-gray-600">{s.email}</p>
                      <p
                        className={`text-sm font-semibold capitalize mt-1 ${s.status === "signed" ? "text-green-500" : "text-yellow-500"}`}
                      >
                        {s.status}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getSignatureTypeColor(signatureType)}`}>
                          {getSignatureTypeLabel(signatureType)}
                        </span>
                      </div>
                      
                      {/* Détails spécifiques pour les signatures AES */}
                      {signatureType === 'aes' && s.status === 'signed' && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <h4 className="text-sm font-semibold text-yellow-800 mb-2">Détails de la signature AES</h4>
                          <div className="space-y-1 text-xs text-yellow-700">
                            <div className="flex justify-between">
                              <span>Méthode de validation:</span>
                              <span className="font-medium">Email + 2FA</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Horodatage:</span>
                              <span className="font-medium">
                                {events.find(e => e.type === 'signed' && e.userName === s.name)?.date 
                                  ? new Date(events.find(e => e.type === 'signed' && e.userName === s.name)!.date).toLocaleString('fr-FR')
                                  : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Niveau de sécurité:</span>
                              <span className="font-medium">Élevé</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Conformité:</span>
                              <span className="font-medium">eIDAS</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Détails spécifiques pour les signatures SES */}
                      {signatureType === 'ses' && s.status === 'signed' && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <h4 className="text-sm font-semibold text-blue-800 mb-2">Détails de la signature SES</h4>
                          <div className="space-y-1 text-xs text-blue-700">
                            <div className="flex justify-between">
                              <span>Méthode de validation:</span>
                              <span className="font-medium">Email</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Horodatage:</span>
                              <span className="font-medium">
                                {events.find(e => e.type === 'signed' && e.userName === s.name)?.date 
                                  ? new Date(events.find(e => e.type === 'signed' && e.userName === s.name)!.date).toLocaleString('fr-FR')
                                  : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Niveau de sécurité:</span>
                              <span className="font-medium">Standard</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Détails spécifiques pour les signatures QES */}
                      {signatureType === 'qes' && s.status === 'signed' && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                          <h4 className="text-sm font-semibold text-green-800 mb-2">Détails de la signature QES</h4>
                          <div className="space-y-1 text-xs text-green-700">
                            <div className="flex justify-between">
                              <span>Méthode de validation:</span>
                              <span className="font-medium">Identité vérifiée + QSCD</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Horodatage Qualifié:</span>
                              <span className="font-medium">
                                {events.find(e => e.type === 'signed' && e.userName === s.name)?.date 
                                  ? new Date(events.find(e => e.type === 'signed' && e.userName === s.name)!.date).toLocaleString('fr-FR')
                                  : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Niveau de sécurité:</span>
                              <span className="font-medium">Qualifié (Maximum)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Conformité:</span>
                              <span className="font-medium">eIDAS (Juridiquement équivalent au manuscrit)</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
