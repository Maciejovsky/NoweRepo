from django.contrib import admin
from .models import Category, RegularPizza, SicilianPizza, Toppings, Sub, Pasta, Salad, DinnerPlatters, UserOrder, \
    SavedCarts, SeaFood, Kebab, Soup, Dessert, Drink, Meals
from tinymce.widgets import TinyMCE
from django.db import models



class CategoryAdmin(admin.ModelAdmin):
    formfield_overrides = {
            models.TextField: {'widget': TinyMCE()},
            }


class RegularPizzaAdmin(admin.ModelAdmin):
    formfield_overrides = {
            models.TextField: {'widget': TinyMCE()},
            }


class SicilianPizzaAdmin(admin.ModelAdmin):
    formfield_overrides = {
            models.TextField: {'widget': TinyMCE()},
            }


admin.site.register(Meals)
admin.site.register(Category, CategoryAdmin)
admin.site.register(RegularPizza, RegularPizzaAdmin)
admin.site.register(SicilianPizza, SicilianPizzaAdmin)
admin.site.register(Toppings)
admin.site.register(Sub)
admin.site.register(Pasta)
admin.site.register(Salad)
admin.site.register(DinnerPlatters)
admin.site.register(SeaFood)
admin.site.register(Kebab)
admin.site.register(Soup)
admin.site.register(Dessert)
admin.site.register(Drink)
admin.site.register(UserOrder)
admin.site.register(SavedCarts)

