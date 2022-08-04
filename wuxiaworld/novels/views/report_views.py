from wuxiaworld.novels.models import Report
from wuxiaworld.novels.serializers import ReportPublicSerializer, ReportSerializer
from rest_framework import viewsets
from wuxiaworld.novels.permissions import IsSuperUser, ReadOnly
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response

class ReportSerializerView(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    queryset = Report.objects.all()

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [IsSuperUser, ]
        elif self.action == 'create':
            self.permission_classes = [permissions.AllowAny,]
        else:
            self.permission_classes = [ReadOnly,]
        return super(ReportSerializerView, self).get_permissions()
    
    @action(detail = False, methods = ['get'])
    def public_reports(self, request):
        reports_with_novels = Report.objects.filter(type = Report.ReportTypes.NOVEL_ADD)
        reports_with_chapters = Report.objects.filter(type = Report.ReportTypes.CHAPTER_REPORT)
        rejected_reports = reports_with_novels.filter(status = Report.ReportStatus.REJECTED)
        pending_reports = reports_with_novels.filter(status = Report.ReportStatus.PENDING)
        approved_reports = reports_with_novels.filter(status = Report.ReportStatus.APPROVED_CLOSED)
        chapter_reports = reports_with_chapters.all()
        data = {
            "rejected_reports": rejected_reports,
            "pending_reports": pending_reports,
            "approved_reports": approved_reports,
            "chapter_reports": chapter_reports
        }
        serializer = ReportPublicSerializer(data)
        return Response(serializer.data)