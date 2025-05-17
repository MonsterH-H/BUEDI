import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProject } from "@/contexts/ProjectContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PageLayout from "@/components/PageLayout";
import { ProjectTimeline } from "@/components/project/ProjectTimeline";
import { CalendarCheck, Clock, MessageSquare, ClipboardCheck, FileText, CheckCircle, AlertCircle, RotateCw, User, ArrowRight, Building2, MapPin, Calendar, Wrench, Camera, Image, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ProjectBoard from "@/components/project/ProjectBoard";

// Couleurs du drapeau gabonais
const COLORS = {
  green: "#009e60",
  yellow: "#fcd116",
  blue: "#3a75c4"
};

const ProjectTracking = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { projects, activeProjectId, setActiveProject, completeTask, addComment, addPhoto } = useProject();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [newMessage, setNewMessage] = useState("");
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [tempCaption, setTempCaption] = useState("");
  const [photoUploadStageId, setPhotoUploadStageId] = useState<string | null>(null);

  // Le projet actuellement sélectionné
  const selectedProject = projects.find(p => p.id === activeProjectId) || projects[0];

  // Si l'utilisateur n'est pas connecté, rediriger vers la page d'authentification
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  // Sélectionner le premier projet par défaut si aucun n'est sélectionné
  useEffect(() => {
    if (projects.length > 0 && !activeProjectId) {
      setActiveProject(projects[0].id);
    }
  }, [projects, activeProjectId, setActiveProject]);

  // Gérer l'envoi d'un message
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedProject) {
      // Simuler un ID utilisateur et des infos pour la démo
      const userId = "current-user";
      const userName = "Vous";
      
      // Ajouter une mise à jour au projet
      const update = {
        date: new Date(),
        content: newMessage,
        photos: [], // Pas de photos dans ce cas
        author: userName
      };
      
      // TODO: Implémenter l'ajout de mise à jour au projet via le contexte
      toast.success("Message envoyé!");
      setNewMessage("");
    }
  };

  // Afficher les détails d'une photo
  const handlePhotoClick = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setShowPhotoDialog(true);
  };

  // Handler pour ajouter une photo
  const handleAddPhoto = (stageId: string) => {
    setPhotoUploadStageId(stageId);
    
    // Dans une vraie application, ouvrir une boîte de dialogue pour sélectionner une photo
    // Pour la démo, on va simplement simuler l'ajout d'une photo
    const mockPhotoUrl = "https://source.unsplash.com/random/800x600/?construction";
    
    // Demander une légende (dans une vraie application, ce serait dans une boîte de dialogue)
    const caption = prompt("Ajouter une légende pour cette photo:");
    
    if (caption !== null) {
      addPhoto(selectedProject.id, stageId, mockPhotoUrl, caption);
      toast.success("Photo ajoutée!");
    }
  };

  // Handler pour ajouter un commentaire
  const handleAddComment = (stageId: string, comment: string) => {
    if (comment.trim() && selectedProject) {
      // Simuler un ID utilisateur et des infos pour la démo
      const userId = "current-user";
      const userName = "Vous";
      
      addComment(selectedProject.id, stageId, comment, userId, userName);
      toast.success("Commentaire ajouté!");
    }
  };

  // État du statut du projet
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50">En attente</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="text-blue-600 border-blue-400 bg-blue-50">En cours</Badge>;
      case "completed":
        return <Badge variant="outline" className="text-green-600 border-green-400 bg-green-50">Terminé</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="text-red-600 border-red-400 bg-red-50">Annulé</Badge>;
      default:
        return null;
    }
  };

  // État des jalons
  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
    }
  };

  // Si aucun projet n'est trouvé
  if (!selectedProject) {
    return (
      <PageLayout>
        <div className="container max-w-6xl px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Suivi de projets</h1>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-medium mb-4">Vous n'avez pas encore de projets</h2>
            <p className="text-gray-500 mb-6">Commencez par publier un nouveau projet de construction ou de rénovation.</p>
            <Button onClick={() => navigate("/project-publish")}>
              Publier un projet
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container max-w-6xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Suivi de projets</h1>
          <Button onClick={() => navigate("/project-publish")}>
            Nouveau projet
          </Button>
        </div>

        {/* Liste des projets */}
        {projects.length > 1 && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <h2 className="text-lg font-medium p-4 border-b dark:border-gray-700">Mes projets</h2>
            <div className="divide-y dark:divide-gray-700">
              {projects.map(project => (
                <div 
                  key={project.id}
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                    project.id === selectedProject.id ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                  onClick={() => setActiveProject(project.id)}
                >
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(project.status)}
                    <div>
                      <div className="flex items-center justify-end text-sm mb-1">
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Détails du projet sélectionné */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                <div className="flex flex-col md:flex-row md:items-center gap-y-1 md:gap-x-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{selectedProject.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      Début: {format(new Date(selectedProject.startDate), 'dd MMM yyyy', { locale: fr })}
                      {selectedProject.endDate && ` - Fin prévue: ${format(new Date(selectedProject.endDate), 'dd MMM yyyy', { locale: fr })}`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-1" />
                    <span>{selectedProject.contractor ? selectedProject.contractor.name : "Pas d'entrepreneur assigné"}</span>
                  </div>
                </div>
              </div>
              <div>
                {getStatusBadge(selectedProject.status)}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mt-4">{selectedProject.description}</p>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Progression globale</span>
                <span className="font-medium">{selectedProject.progress}%</span>
              </div>
              <Progress value={selectedProject.progress} className="h-2" />
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="timeline">Chronologie</TabsTrigger>
            <TabsTrigger value="board">Tableau</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Onglet Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* Vignettes des phases principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <CalendarCheck className="h-5 w-5 mr-2 text-buedi-blue" />
                    Planning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedProject.stages.slice(0, 3).map((stage, index) => (
                      <div key={stage.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getMilestoneIcon(stage.status)}
                          <span className="text-sm ml-2">{stage.title}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(stage.endDate || stage.startDate), 'dd/MM', { locale: fr })}
                        </span>
                      </div>
                    ))}
                    {selectedProject.stages.length > 3 && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="pl-0 text-xs"
                        onClick={() => setSelectedTab("timeline")}
                      >
                        Voir toutes les phases
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Wrench className="h-5 w-5 mr-2 text-buedi-blue" />
                    Entrepreneurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedProject.contractor ? (
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={selectedProject.contractor.photo} alt={selectedProject.contractor.name} />
                        <AvatarFallback>
                          {selectedProject.contractor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedProject.contractor.name}</p>
                        <div className="flex items-center text-amber-500 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`text-sm ${i < Math.floor(selectedProject.contractor.rating) ? 'text-amber-500' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                          <span className="text-xs text-gray-500 ml-1">({selectedProject.contractor.rating})</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Aucun entrepreneur assigné</p>
                      <Button variant="secondary" size="sm" className="mt-2">
                        Trouver un entrepreneur
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-buedi-blue" />
                    Dernières mises à jour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedProject.updates.slice(0, 2).map((update, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium">{update.author}</span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(update.date), 'dd MMM', { locale: fr })}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">{update.content}</p>
                        {update.photos.length > 0 && (
                          <div className="flex mt-2 space-x-2">
                            {update.photos.slice(0, 2).map((photo, photoIndex) => (
                              <img 
                                key={photoIndex} 
                                src={photo} 
                                alt={`Photo ${photoIndex}`} 
                                className="h-12 w-12 object-cover rounded"
                                onClick={() => handlePhotoClick(photo)}
                              />
                            ))}
                            {update.photos.length > 2 && (
                              <div 
                                className="h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center cursor-pointer"
                                onClick={() => {/* Vue détaillée des photos */}}
                              >
                                <span className="text-sm text-gray-500">+{update.photos.length - 2}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {selectedProject.updates.length > 2 ? (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="pl-0 text-xs"
                        onClick={() => {/* Afficher toutes les mises à jour */}}
                      >
                        Voir toutes les mises à jour
                      </Button>
                    ) : selectedProject.updates.length === 0 && (
                      <p className="text-center text-gray-500 py-2 text-sm">Aucune mise à jour</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulaire de message */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Envoyer un message</CardTitle>
                <CardDescription>Communiquez avec les intervenants du projet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarFallback>UT</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <textarea
                      className="w-full min-h-[100px] p-3 border rounded-lg text-sm resize-none dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Écrivez votre message ici..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    ></textarea>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Camera className="h-3.5 w-3.5 mr-1.5" />
                          Ajouter une photo
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <FileText className="h-3.5 w-3.5 mr-1.5" />
                          Joindre un fichier
                        </Button>
                      </div>
                      <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        Envoyer
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Chronologie */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Chronologie du projet</CardTitle>
                <CardDescription>Suivez l'avancement des différentes phases de votre projet</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectTimeline 
                  stages={selectedProject.stages}
                  onAddPhoto={handleAddPhoto}
                  onAddComment={handleAddComment}
                  onCompleteTask={(stageId, taskId) => {
                    completeTask(selectedProject.id, stageId, taskId);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nouvel onglet Tableau */}
          <TabsContent value="board">
            <Card>
              <CardHeader>
                <CardTitle>Tableau des tâches</CardTitle>
                <CardDescription>Organisez et suivez vos tâches avec une vue tableau kanban</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProject && <ProjectBoard projectId={selectedProject.id} />}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Documents */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents du projet</CardTitle>
                <CardDescription>Tous les documents liés à votre projet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedProject.documents.length > 0 ? (
                    selectedProject.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center mr-3">
                            <FileText className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(doc.date), 'dd MMM yyyy', { locale: fr })} • {doc.type.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Télécharger
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Aucun document disponible</p>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Ajouter un document
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogue d'affichage de photo */}
        <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden">
            <div className="relative">
              <img 
                src={selectedPhoto} 
                alt="Photo du projet" 
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full"
                onClick={() => setShowPhotoDialog(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default ProjectTracking;
