"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Calendar, Copy, ExternalLink, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";

interface Discount {
  id: string;
  brand_name: string;
  brand_logo: string | null;
  description: string;
  discount_code: string | null;
  category: string;
  valid_until: string;
}

interface DiscountsGridProps {
  discounts: Discount[];
}

const CATEGORIES = [
  "Food",
  "Tech",
  "Fashion",
  "Travel",
  "Education",
  "Entertainment",
];

export function DiscountsGrid({
  discounts: initialDiscounts,
}: DiscountsGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCategoryFilter = (category: string) => {
    const newCategory = selectedCategory === category ? "" : category;
    setSelectedCategory(newCategory);
    const params = new URLSearchParams();
    if (newCategory) params.set("category", newCategory);
    router.push(`/discounts?${params.toString()}`);
  };

  const handleCopyCode = (code: string, discountId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(discountId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: "bg-orange-100 text-orange-700 hover:bg-orange-200",
      Tech: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      Fashion: "bg-pink-100 text-pink-700 hover:bg-pink-200",
      Travel: "bg-green-100 text-green-700 hover:bg-green-200",
      Education: "bg-purple-100 text-purple-700 hover:bg-purple-200",
      Entertainment: "bg-red-100 text-red-700 hover:bg-red-200",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <div className="space-y-2">
        <h3 className="font-semibold">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                selectedCategory === category
                  ? "bg-primary hover:bg-brand-red-hover"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => handleCategoryFilter(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="border-t pt-4">
        <p className="text-sm text-muted-foreground">
          {initialDiscounts.length}{" "}
          {initialDiscounts.length === 1 ? "discount" : "discounts"} available
        </p>
      </div>

      {/* Discounts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {initialDiscounts.length > 0 ? (
          initialDiscounts.map((discount) => (
            <Card
              key={discount.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Brand Logo */}
              <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                {discount.brand_logo ? (
                  <img
                    src={discount.brand_logo || "/placeholder.svg"}
                    alt={discount.brand_name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <Gift className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="font-bold text-lg text-gray-700">
                      {discount.brand_name}
                    </p>
                  </div>
                )}
              </div>

              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-lg">
                    {discount.brand_name}
                  </h3>
                  <Badge className={getCategoryColor(discount.category)}>
                    {discount.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {discount.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Discount Code */}
                {discount.discount_code && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Discount Code
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 rounded-lg border-2 border-dashed border-primary bg-primary px-4 py-3 font-mono font-bold text-center text-white">
                        {discount.discount_code}
                      </div>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          handleCopyCode(discount.discount_code!, discount.id)
                        }
                        className="bg-transparent"
                      >
                        {copiedCode === discount.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Valid Until */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Valid until{" "}
                    {format(new Date(discount.valid_until), "MMM dd, yyyy")}
                  </span>
                </div>

                {/* Action Button */}
                <Button className="w-full bg-primary hover:bg-brand-red-hover">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Redeem Now
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full rounded-lg border-2 border-dashed bg-white p-12 text-center">
            <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No discounts found in this category.
            </p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => {
                setSelectedCategory("");
                router.push("/discounts");
              }}
            >
              View All Discounts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
