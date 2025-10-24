from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    def __str__(self): return self.name

class Transaction(models.Model):
    INCOME = 'IN'
    EXPENSE = 'EX'
    TYPE_CHOICES = [(INCOME,'Income'), (EXPENSE,'Expense')]
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='transactions')
    category = models.ForeignKey(Category,on_delete=models.SET_NULL,null=True,blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=2,choices=TYPE_CHOICES)
    note = models.CharField(max_length=255, blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"{self.user.username}-{self.get_transaction_type_display()}-{self.amount}"

class Budget(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='budgets')
    month = models.DateField()
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    def __str__(self): return f"{self.user.username} Budget {self.month}"
