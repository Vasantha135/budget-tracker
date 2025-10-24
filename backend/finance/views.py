from rest_framework import viewsets, permissions
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer


# --------------------
# Category ViewSet
# --------------------
class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user).order_by('name')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context


# --------------------
# Transaction ViewSet
# --------------------
class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-date')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    def perform_create(self, serializer):
        # ✅ Do NOT pass user again here (already set in serializer)
        serializer.save()


# --------------------
# Budget ViewSet
# --------------------
class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user).order_by('-year', '-month')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    def perform_create(self, serializer):
        serializer.save()
