from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from finance.models import Category, Transaction, Budget
from datetime import date

class Command(BaseCommand):
    def handle(self, *args, **options):
        user, created = User.objects.get_or_create(username='testuser')
        if created:
            user.set_password('TestPassword123!')
            user.save()
        cat = Category.objects.create(name='Food', user=user)
        Transaction.objects.create(user=user, category=cat, amount=100, transaction_type='EX', note='Lunch', date=date.today())
        Budget.objects.create(user=user, month=date.today().replace(day=1), amount=2000)
        self.stdout.write("Seeded user: testuser / TestPassword123!")
