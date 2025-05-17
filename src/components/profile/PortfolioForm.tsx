
import { useState } from "react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const PortfolioForm = ({ form }) => {
  const [portfolioItems, setPortfolioItems] = useState([
    { id: "1", title: "", description: "", imageFile: null, imagePreview: null }
  ])

  const addPortfolioItem = () => {
    const newId = (parseInt(portfolioItems[portfolioItems.length - 1].id) + 1).toString()
    setPortfolioItems([
      ...portfolioItems,
      { id: newId, title: "", description: "", imageFile: null, imagePreview: null }
    ])
  }

  const removePortfolioItem = (id) => {
    if (portfolioItems.length === 1) return
    setPortfolioItems(portfolioItems.filter(item => item.id !== id))
  }

  const handleImageChange = (id, e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const updatedItems = portfolioItems.map(item => {
        if (item.id === id) {
          return {
            ...item, 
            imageFile: file,
            imagePreview: e.target?.result
          }
        }
        return item
      })
      setPortfolioItems(updatedItems)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Projets réalisés</h3>
        
        <div className="space-y-6">
          {portfolioItems.map((item, index) => (
            <div key={item.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Projet {index + 1}</h4>
                {portfolioItems.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removePortfolioItem(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Supprimer
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`portfolio.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre du projet</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Rénovation villa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col">
                  <FormLabel className="mb-2">Photo du projet</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(item.id, e)}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              <div className="mt-3">
                <FormField
                  control={form.control}
                  name={`portfolio.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <textarea 
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                          placeholder="Décrivez ce projet..." 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {item.imagePreview && (
                <div className="mt-3">
                  <img 
                    src={item.imagePreview} 
                    alt="Aperçu du projet" 
                    className="h-40 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <Button 
          type="button" 
          variant="outline" 
          onClick={addPortfolioItem}
          className="mt-4 w-full border-dashed"
        >
          Ajouter un projet
        </Button>
      </div>
    </div>
  )
}

export default PortfolioForm
