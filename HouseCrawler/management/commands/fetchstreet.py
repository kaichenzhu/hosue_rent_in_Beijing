from django.core.management.base import BaseCommand, CommandError
from HouseCrawler.street import Streets

class Command(BaseCommand):
    help = 'fetch all streets in Beijing'

    def add_arguments(self, parser):
        parser.add_argument('threads_num', type=int)

    def handle(self, *args, **options):
        try:
            pass
            threads_num = min(options['threads_num'], 7)
            streets = Streets()
            streets.fetch_streets(threads_num)
        except Exception:
            raise CommandError('Commnad does not exist')
        self.stdout.write('Successfully fetch all streets of Beijing')