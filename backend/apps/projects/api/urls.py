from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, TaskViewSet, MilestoneViewSet, TimeLogViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'milestones', MilestoneViewSet, basename='milestone')
router.register(r'time-logs', TimeLogViewSet, basename='timelog')

from .views import TaskTimesheetViewSet, SprintViewSet, TaskTagViewSet
router.register(r'task-timesheets', TaskTimesheetViewSet, basename='tasktimesheet')
router.register(r'sprints', SprintViewSet, basename='sprint')
router.register(r'task-tags', TaskTagViewSet, basename='tasktag')

urlpatterns = [
    path('', include(router.urls)),
]
