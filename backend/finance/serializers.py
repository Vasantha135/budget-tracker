from rest_framework import serializers
from .models import Category, Transaction, Budget


# --------------------
# Category Serializer
# --------------------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


# --------------------
# Transaction Serializer
# --------------------
class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category = serializers.CharField(write_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'transaction_type', 'note', 'date', 'category', 'category_name']

    def create(self, validated_data):
        # ✅ Get category name and logged-in user
        category_name = validated_data.pop('category')
        user = self.context['request'].user

        # ✅ Find or create category for this user
        category_obj, _ = Category.objects.get_or_create(name=category_name, user=user)

        # ✅ Create transaction linked to category and user
        transaction = Transaction.objects.create(category=category_obj, user=user, **validated_data)
        return transaction

    def update(self, instance, validated_data):
        # ✅ Update transaction + category
        category_name = validated_data.pop('category', None)
        user = self.context['request'].user

        if category_name:
            category_obj, _ = Category.objects.get_or_create(name=category_name, user=user)
            instance.category = category_obj

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


# --------------------
# Budget Serializer
# --------------------
class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category = serializers.CharField(write_only=True)

    class Meta:
        model = Budget
        fields = ['id', 'category', 'category_name', 'limit', 'month', 'year']

    def create(self, validated_data):
        category_name = validated_data.pop('category')
        user = self.context['request'].user
        category_obj, _ = Category.objects.get_or_create(name=category_name, user=user)
        budget = Budget.objects.create(category=category_obj, user=user, **validated_data)
        return budget
