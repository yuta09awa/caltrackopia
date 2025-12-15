import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import type { MenuItem, MenuItemFormData } from '../types';

const ALLERGENS = [
  'Dairy', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts', 
  'Peanuts', 'Wheat', 'Soy', 'Sesame'
];

const DIETARY_TAGS = [
  'Vegan', 'Vegetarian', 'Gluten-Free', 'Halal', 
  'Kosher', 'Keto', 'Low-Carb', 'High-Protein'
];

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive').optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  calories: z.coerce.number().min(0).optional(),
  protein: z.coerce.number().min(0).optional(),
  carbohydrates: z.coerce.number().min(0).optional(),
  fat: z.coerce.number().min(0).optional(),
  fiber: z.coerce.number().min(0).optional(),
  sugar: z.coerce.number().min(0).optional(),
  sodium: z.coerce.number().min(0).optional(),
  allergens: z.array(z.string()).default([]),
  dietary_tags: z.array(z.string()).default([]),
  is_available: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface MenuItemEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
  onSave: (data: MenuItemFormData) => Promise<void>;
  isSaving: boolean;
}

export default function MenuItemEditor({
  open,
  onOpenChange,
  item,
  onSave,
  isSaving,
}: MenuItemEditorProps) {
  const isEditing = !!item;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      price: undefined,
      image_url: '',
      calories: undefined,
      protein: undefined,
      carbohydrates: undefined,
      fat: undefined,
      fiber: undefined,
      sugar: undefined,
      sodium: undefined,
      allergens: [],
      dietary_tags: [],
      is_available: true,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        description: item.description || '',
        category: item.category || '',
        price: item.price ?? undefined,
        image_url: item.image_url || '',
        calories: item.calories ?? undefined,
        protein: item.protein ?? undefined,
        carbohydrates: item.carbohydrates ?? undefined,
        fat: item.fat ?? undefined,
        fiber: item.fiber ?? undefined,
        sugar: item.sugar ?? undefined,
        sodium: item.sodium ?? undefined,
        allergens: item.allergens || [],
        dietary_tags: item.dietary_tags || [],
        is_available: item.is_available ?? true,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        category: '',
        price: undefined,
        image_url: '',
        calories: undefined,
        protein: undefined,
        carbohydrates: undefined,
        fat: undefined,
        fiber: undefined,
        sugar: undefined,
        sodium: undefined,
        allergens: [],
        dietary_tags: [],
        is_available: true,
      });
    }
  }, [item, form]);

  const handleSubmit = async (values: FormValues) => {
    await onSave({
      name: values.name,
      description: values.description || null,
      category: values.category || null,
      price: values.price ?? null,
      image_url: values.image_url || null,
      calories: values.calories ?? null,
      protein: values.protein ?? null,
      carbohydrates: values.carbohydrates ?? null,
      fat: values.fat ?? null,
      fiber: values.fiber ?? null,
      sugar: values.sugar ?? null,
      sodium: values.sodium ?? null,
      allergens: values.allergens,
      dietary_tags: values.dietary_tags,
      is_available: values.is_available,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Menu Item' : 'Add Menu Item'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                <TabsTrigger value="dietary">Dietary</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Grilled Salmon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the dish..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Main Course" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="nutrition" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="calories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calories (kcal)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="protein"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Protein (g)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="carbohydrates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carbs (g)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fat (g)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fiber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fiber (g)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sugar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sugar (g)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sodium"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sodium (mg)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="dietary" className="space-y-6 mt-4">
                <FormField
                  control={form.control}
                  name="allergens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergens</FormLabel>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {ALLERGENS.map((allergen) => (
                          <div key={allergen} className="flex items-center space-x-2">
                            <Checkbox
                              id={`allergen-${allergen}`}
                              checked={field.value?.includes(allergen)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, allergen]);
                                } else {
                                  field.onChange(field.value.filter((a) => a !== allergen));
                                }
                              }}
                            />
                            <label 
                              htmlFor={`allergen-${allergen}`}
                              className="text-sm cursor-pointer"
                            >
                              {allergen}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dietary_tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary Tags</FormLabel>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {DIETARY_TAGS.map((tag) => (
                          <div key={tag} className="flex items-center space-x-2">
                            <Checkbox
                              id={`tag-${tag}`}
                              checked={field.value?.includes(tag)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, tag]);
                                } else {
                                  field.onChange(field.value.filter((t) => t !== tag));
                                }
                              }}
                            />
                            <label 
                              htmlFor={`tag-${tag}`}
                              className="text-sm cursor-pointer"
                            >
                              {tag}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : isEditing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
