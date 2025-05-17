import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PaymentMethods } from './PaymentMethods';
import { useCart } from '@/contexts/CartContext';
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Trash2,
  Package,
  Truck,
  CreditCard,
  ArrowRight,
  AlertCircle,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    total,
    itemCount,
    deliveryFee,
    setDeliveryMethod,
    deliveryMethod,
    applyPromoCode,
    discount,
    promoCode,
    clearCart
  } = useCart();

  const [localPromoCode, setLocalPromoCode] = useState(promoCode);

  const handleApplyPromoCode = () => {
    applyPromoCode(localPromoCode);
  };

  const handleQuantityChange = (id: number, change: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity + change);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-GA', { 
      style: 'currency', 
      currency: 'XAF' 
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Panier</h2>
                <Badge variant="secondary">{itemCount} articles</Badge>
              </div>
              <div className="flex items-center space-x-2">
                {items.length > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={clearCart}
                          className="text-red-500 hover:text-red-600"
                          aria-label="Vider le panier"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Vider le panier</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose}
                  aria-label="Fermer le panier"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Cart Items */}
            <ScrollArea className="flex-1 p-4">
              {items.length > 0 ? (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex space-x-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.seller}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Supprimer ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">{item.unit}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              aria-label={`Diminuer la quantité de ${item.name}`}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span id={`quantity-${item.id}`}>{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              aria-label={`Augmenter la quantité de ${item.name}`}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <span className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                        {item.quantity >= item.stock && (
                          <div className="mt-2 flex items-center text-amber-600 text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Stock maximum atteint
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-center">
                    Votre panier est vide
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={onClose}
                  >
                    Continuer mes achats
                  </Button>
                </div>
              )}
            </ScrollArea>

            {items.length > 0 && (
              <div className="border-t p-4 space-y-4">
                {/* Promo Code */}
                <div className="flex space-x-2">
                  <Input
                    id="promo-code"
                    name="promo-code"
                    placeholder="Code promo"
                    value={localPromoCode}
                    onChange={(e) => setLocalPromoCode(e.target.value)}
                    aria-label="Code promo"
                  />
                  <Button 
                    variant="outline"
                    onClick={handleApplyPromoCode}
                    aria-label="Appliquer le code promo"
                  >
                    Appliquer
                  </Button>
                </div>

                {/* Delivery Method */}
                <div className="space-y-2">
                  <h3 className="font-medium">Méthode de livraison</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      id="delivery-standard"
                      variant={deliveryMethod === "standard" ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setDeliveryMethod("standard")}
                      aria-label="Livraison standard"
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Standard
                    </Button>
                    <Button
                      id="delivery-express"
                      variant={deliveryMethod === "express" ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setDeliveryMethod("express")}
                      aria-label="Livraison express"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Express
                    </Button>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span id="subtotal">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Réduction ({discount}%)</span>
                      <span>-{formatPrice(subtotal * (discount / 100))}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span id="delivery-fee">{formatPrice(deliveryFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span id="total">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <PaymentMethods />

                {/* Checkout Button */}
                <Button 
                  className="w-full bg-buedi-blue hover:bg-buedi-blue/90"
                  aria-label="Procéder au paiement"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payer maintenant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                {/* Info */}
                <div className="flex items-start space-x-2 text-sm text-gray-500">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Les prix et la disponibilité des produits peuvent varier. 
                    Votre panier sera sauvegardé pendant 48h.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
