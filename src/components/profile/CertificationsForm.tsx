
import { useState } from "react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"

const CertificationsForm = ({ form }) => {
  const [certifications, setCertifications] = useState([
    { id: "1", name: "", issuer: "", year: "", file: null, filePreview: null }
  ])

  const addCertification = () => {
    const newId = (parseInt(certifications[certifications.length - 1].id) + 1).toString()
    setCertifications([
      ...certifications,
      { id: newId, name: "", issuer: "", year: "", file: null, filePreview: null }
    ])
  }

  const removeCertification = (id) => {
    if (certifications.length === 1) return
    setCertifications(certifications.filter(item => item.id !== id))
  }

  const handleFileChange = (id, e) => {
    const file = e.target.files[0]
    if (!file) return

    const updatedItems = certifications.map(item => {
      if (item.id === id) {
        return {
          ...item, 
          file: file,
          filePreview: file.name
        }
      }
      return item
    })
    setCertifications(updatedItems)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Documents légaux</h3>
        
        <Card className="border-yellow-300">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="hasRccm"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        RCCM (Registre du Commerce)
                      </FormLabel>
                      <FormDescription>
                        J'ai un numéro RCCM que je peux fournir
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {form.watch("hasRccm") && (
                <FormField
                  control={form.control}
                  name="rccmNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Numéro RCCM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="hasNif"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        NIF (Numéro d'Identification Fiscale)
                      </FormLabel>
                      <FormDescription>
                        J'ai un NIF que je peux fournir
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {form.watch("hasNif") && (
                <FormField
                  control={form.control}
                  name="nifNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Numéro NIF" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Certifications professionnelles</h3>
        
        <div className="space-y-4">
          {certifications.map((cert, index) => (
            <div key={cert.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Certification {index + 1}</h4>
                {certifications.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeCertification(cert.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Supprimer
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`certifications.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la certification</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Certification en sécurité" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`certifications.${index}.issuer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organisme émetteur</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Ministère du BTP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <FormField
                  control={form.control}
                  name={`certifications.${index}.year`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Année d'obtention</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col">
                  <FormLabel className="mb-2">Fichier justificatif</FormLabel>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(cert.id, e)}
                    className="cursor-pointer"
                  />
                  {cert.filePreview && (
                    <span className="text-xs mt-1 text-slate-500">{cert.filePreview}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button 
          type="button" 
          variant="outline" 
          onClick={addCertification}
          className="mt-4 w-full border-dashed"
        >
          Ajouter une certification
        </Button>
      </div>
    </div>
  )
}

export default CertificationsForm
