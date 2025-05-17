
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"

const specialties = [
  {
    id: "construction",
    label: "Construction neuve",
  },
  {
    id: "renovation",
    label: "Rénovation",
  },
  {
    id: "plumbing",
    label: "Plomberie",
  },
  {
    id: "electrical",
    label: "Électricité",
  },
  {
    id: "carpentry",
    label: "Menuiserie",
  },
  {
    id: "painting",
    label: "Peinture",
  },
  {
    id: "masonry",
    label: "Maçonnerie",
  },
  {
    id: "roofing",
    label: "Toiture",
  },
  {
    id: "flooring",
    label: "Revêtement de sol",
  },
  {
    id: "landscaping",
    label: "Aménagement paysager",
  },
  {
    id: "architecture",
    label: "Architecture",
  },
  {
    id: "interior-design",
    label: "Design d'intérieur",
  },
]

const SkillsForm = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Spécialités</h3>
        <p className="text-sm text-slate-500 mb-4">
          Sélectionnez les services que vous proposez.
        </p>
        
        <FormField
          control={form.control}
          name="specialties"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {specialties.map((specialty) => (
                  <FormField
                    key={specialty.id}
                    control={form.control}
                    name="specialties"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={specialty.id}
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-white shadow-sm hover:bg-slate-50"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(specialty.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), specialty.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== specialty.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {specialty.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Années d'expérience</FormLabel>
            <FormControl>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                {...field}
              >
                <option value="">Sélectionnez</option>
                <option value="0-2">0-2 ans</option>
                <option value="3-5">3-5 ans</option>
                <option value="6-10">6-10 ans</option>
                <option value="11-15">11-15 ans</option>
                <option value="16+">Plus de 15 ans</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default SkillsForm
